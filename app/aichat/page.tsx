"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {hotTopicsApi} from '../api/api'
import { Sparkles, Xmark, Plus, Ghost, Comment, TrashBin, ChevronLeft, Clock, Stop, PaperPlane } from '@gravity-ui/icons';

/* ───────── Types ───────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/* ───────── Constants ───────── */
const STORAGE_KEY = "aichat_sessions";
const ACTIVE_KEY = "aichat_active_session";

const suggestQuestions = [
  "🔍 帮我搜索热门话题",
  "✍️ 帮我写一篇笔记",
  "📸 如何拍出好看照片",
  "💡 给我一些创意灵感",
];

/* ───────── Helpers ───────── */
function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

function saveActiveId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** 从首条用户消息中提取会话标题（截断到 20 字） */
function extractTitle(msg: string): string {
  const clean = msg.replace(/[\n\r]/g, " ").trim();
  return clean.length > 20 ? clean.slice(0, 20) + "…" : clean;
}

/* ───────── Sparkle Icon (reused) ───────── */
function SparkleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <Sparkles className={className} />;
}

const EMPTY_MESSAGES: Message[] = [];
/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function AIChatPage() {
  /* ── state ── */
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /* ── derived ── */
  const activeSession = sessions.find((s) => s.id === activeId) ?? null;
  const messages = activeSession?.messages ?? EMPTY_MESSAGES;

  /* ── init: load from localStorage ── */
  useEffect(() => {
    const stored = loadSessions();
    const storedActiveId = loadActiveId();
    if (stored.length > 0) {
      setSessions(stored);
      if (storedActiveId && stored.some((s) => s.id === storedActiveId)) {
        setActiveId(storedActiveId);
      }
      // 不自动选中任何会话 — 让用户看到欢迎页
    }
    setMounted(true);
  }, []);

  /* ── persist sessions whenever they change ── */
  useEffect(() => {
    if (mounted) saveSessions(sessions);
  }, [sessions, mounted]);

  useEffect(() => {
    if (mounted && activeId) saveActiveId(activeId);
  }, [activeId, mounted]);

  /* ── scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isStreaming]);

  /* ── helpers ── */
  const createSession = useCallback((): string => {
    const id = generateId();
    const session: ChatSession = {
      id,
      title: "新对话",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const updateSessionMessages = useCallback(
    (sessionId: string, updater: (msgs: Message[]) => Message[]) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const newMsgs = updater(s.messages);
          const title =
            s.title === "新对话" && newMsgs.length > 0
              ? extractTitle(
                  newMsgs.find((m) => m.role === "user")?.content ?? "新对话"
                )
              : s.title;
          return { ...s, messages: newMsgs, title, updatedAt: Date.now() };
        })
      );
    },
    []
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  /* ── textarea auto-height ── */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  /* ── stop streaming ── */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
    setIsStreaming(false);
  }, []);

  /* ── fetch streaming reply from /api/chat ── */
  const fetchStreamReply = useCallback(
    async (sessionId: string, allMessages: Message[]) => {
      setIsTyping(true);

      // 创建一个空的 assistant 消息占位
      const assistantMsgId = generateId();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      updateSessionMessages(sessionId, (msgs) => [...msgs, assistantMsg]);

      // 短暂延迟让 typing indicator 显示
      await new Promise((r) => setTimeout(r, 300));
      setIsTyping(false);
      setIsStreaming(true);

      // 准备 AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 构建请求消息体（发送该会话的历史消息给后端）
      const chatMessages = allMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let accumulated = "";

      try {
        // 获取 token
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // const response = await fetch("/api/chat", {
        //   method: "POST",
        //   headers,
        //   body: JSON.stringify({ messages: chatMessages }),
        //   signal: controller.signal,
        // });
        const response = await hotTopicsApi.getChat(allMessages[allMessages.length - 1].content)

        if (!response.ok) {
          const errorText = await response.text().catch(() => "请求失败");
          accumulated = `⚠️ 请求失败 (${response.status}): ${errorText}`;
          updateSessionMessages(sessionId, (msgs) =>
            msgs.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulated } : m
            )
          );
          setIsStreaming(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          accumulated = "⚠️ 无法读取响应流";
          updateSessionMessages(sessionId, (msgs) =>
            msgs.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulated } : m
            )
          );
          setIsStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // 尝试按 SSE 格式解析 (data: ...\n\n)
          // 同时兼容纯文本流
          const lines = buffer.split("\n");
          // 保留最后一行（可能不完整）
          buffer = lines.pop() || "";

          for (const line of lines) {
            // SSE 格式: "data: ..."
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              // [DONE] 标记表示结束
              if (data.trim() === "[DONE]") continue;
              try {
                // 尝试解析为 JSON（如 { "content": "..." } 或 { "choices": [...] }）
                const parsed = JSON.parse(data);
                const chunk =
                  parsed.content ||
                  parsed.choices?.[0]?.delta?.content ||
                  parsed.text ||
                  parsed.data ||
                  "";
                if (chunk) accumulated += chunk;
              } catch {
                // 不是 JSON，直接作为文本
                accumulated += data;
              }
            } else if (line.trim() && !line.startsWith(":")) {
              // 纯文本流（非 SSE 注释行）
              accumulated += line;
            }
          }

          // 实时更新消息内容
          updateSessionMessages(sessionId, (msgs) =>
            msgs.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulated } : m
            )
          );
        }

        // 处理 buffer 中剩余的内容
        if (buffer.trim()) {
          if (buffer.startsWith("data: ")) {
            const data = buffer.slice(6);
            if (data.trim() !== "[DONE]") {
              try {
                const parsed = JSON.parse(data);
                const chunk =
                  parsed.content ||
                  parsed.choices?.[0]?.delta?.content ||
                  parsed.text ||
                  parsed.data ||
                  "";
                if (chunk) accumulated += chunk;
              } catch {
                accumulated += data;
              }
            }
          } else if (!buffer.startsWith(":")) {
            accumulated += buffer;
          }

          updateSessionMessages(sessionId, (msgs) =>
            msgs.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulated } : m
            )
          );
        }

        // 如果最终没有任何内容
        if (!accumulated.trim()) {
          updateSessionMessages(sessionId, (msgs) =>
            msgs.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: "（AI 未返回内容，请稍后再试）" }
                : m
            )
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // 用户手动停止
          if (!accumulated.trim()) {
            updateSessionMessages(sessionId, (msgs) =>
              msgs.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: "（已停止生成）" }
                  : m
              )
            );
          }
        } else {
          // 网络错误等
          const errMsg = `⚠️ 请求出错: ${(err as Error).message}`;
          updateSessionMessages(sessionId, (msgs) =>
            msgs.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: accumulated || errMsg }
                : m
            )
          );
        }
      } finally {
        abortControllerRef.current = null;
        setIsStreaming(false);
      }
    },
    [updateSessionMessages]
  );

  /* ── send message ── */
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;

    // 如果当前没有活跃会话则自动创建
    let sid = activeId;
    let currentMessages: Message[] = [];
    if (!sid) {
      sid = generateId();
      const session: ChatSession = {
        id: sid,
        title: extractTitle(text),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions((prev) => [session, ...prev]);
      setActiveId(sid);
    } else {
      // 获取当前会话的消息历史
      const currentSession = sessions.find((s) => s.id === sid);
      currentMessages = currentSession?.messages ?? [];
    }

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const allMessages = [...currentMessages, userMsg];
    updateSessionMessages(sid, (msgs) => [...msgs, userMsg]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    fetchStreamReply(sid, allMessages);
  }, [input, activeId, isStreaming, sessions, updateSessionMessages, fetchStreamReply]);

  const handleQuickQuestion = useCallback(
    (q: string) => {
      if (isStreaming) return;

      let sid = activeId;
      let currentMessages: Message[] = [];
      if (!sid) {
        sid = generateId();
        const session: ChatSession = {
          id: sid,
          title: extractTitle(q),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setSessions((prev) => [session, ...prev]);
        setActiveId(sid);
      } else {
        const currentSession = sessions.find((s) => s.id === sid);
        currentMessages = currentSession?.messages ?? [];
      }

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: q,
        timestamp: Date.now(),
      };
      const allMessages = [...currentMessages, userMsg];
      updateSessionMessages(sid, (msgs) => [...msgs, userMsg]);
      fetchStreamReply(sid, allMessages);
    },
    [activeId, isStreaming, sessions, updateSessionMessages, fetchStreamReply]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── date formatting ── */
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return "今天";
    if (isYesterday) return "昨天";
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  /* ── group sessions by date ── */
  const groupedSessions = sessions.reduce<Record<string, ChatSession[]>>(
    (acc, s) => {
      const key = formatDate(s.updatedAt);
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {}
  );

  if (!mounted) return null;

  /* ═══════════════════════════════════════════
     Render
     ═══════════════════════════════════════════ */
  return (
    <div
      className="h-dvh max-w-lg mx-auto flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f8f7ff 0%, #f3f4f6 100%)" }}
    >
      {/* ─── History Drawer (RIGHT side, overlay) ─── */}
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
        onClick={() => setDrawerOpen(false)}
      />

      {/* drawer panel — slides from RIGHT */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[82%] max-w-sm flex flex-col transition-transform duration-300`}
        style={{
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          background: "linear-gradient(180deg, #ffffff 0%, #f9f8ff 100%)",
          boxShadow: drawerOpen ? "-8px 0 40px rgba(0,0,0,0.12)" : "none",
          borderRadius: "20px 0 0 20px",
        }}
      >
        {/* drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
        >
          {/* close (left) */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all duration-150"
            style={{ background: "rgba(0,0,0,0.04)" }}
          >
            <Xmark className="text-gray-500" width={18} height={18} />
          </button>

          <h2 className="text-[15px] font-semibold text-gray-800">聊天记录</h2>

          {/* new chat (right) */}
          <button
            onClick={() => { createSession(); setDrawerOpen(false); }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white active:scale-90 transition-all duration-150"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
            title="新建对话"
          >
            <Plus width={16} height={16} />
          </button>
        </div>

        {/* session list */}
        <div className="flex-1 overflow-y-auto px-3 py-2" style={{ WebkitOverflowScrolling: "touch" }}>
          {sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(124,58,237,0.06)" }}>
                <Ghost width={32} height={32} style={{ color: "rgba(124,58,237,0.3)" }} />
              </div>
              <p className="text-sm font-medium text-gray-400">暂无聊天记录</p>
              <p className="text-xs text-gray-300 mt-1">开始一段新对话吧</p>
            </div>
          )}

          {Object.entries(groupedSessions).map(([date, items]) => (
            <div key={date}>
              <div className="px-2 pt-4 pb-1.5">
                <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">{date}</span>
              </div>
              {items.map((s) => (
                <div
                  key={s.id}
                  onClick={() => { setActiveId(s.id); setDrawerOpen(false); }}
                  className="group flex items-center gap-3 mb-1.5 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: s.id === activeId ? "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.06))" : "transparent",
                    border: s.id === activeId ? "1px solid rgba(124,58,237,0.15)" : "1px solid transparent",
                  }}
                >
                  {/* icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: s.id === activeId ? "linear-gradient(135deg, #7c3aed, #3b82f6)" : "rgba(0,0,0,0.04)",
                    }}
                  >
                    <Comment width={20} height={20} style={{ color: s.id === activeId ? "#fff" : "#9ca3af" }} />
                  </div>
                  {/* title + count */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] truncate leading-tight"
                      style={{
                        fontWeight: s.id === activeId ? 600 : 400,
                        color: s.id === activeId ? "#6d28d9" : "#374151",
                      }}
                    >
                      {s.title}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "#9ca3af" }}>
                      {s.messages.length} 条消息
                    </p>
                  </div>
                  {/* delete — always visible on mobile (touch) */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-90"
                    style={{ color: "#d1d5db", background: "transparent" }}
                    title="删除"
                  >
                    <TrashBin width={16} height={16} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* clear all */}
        {sessions.length > 0 && (
          <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <button
              onClick={() => {
                setSessions([]);
                setActiveId(null);
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(ACTIVE_KEY);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium active:scale-[0.97] transition-all duration-200"
              style={{ color: "#ef4444", background: "rgba(239,68,68,0.06)" }}
            >
              <TrashBin width={16} height={16} />
              清空全部记录
            </button>
          </div>
        )}
      </div>

      {/* ─── Header ─── */}
      <header
        className="sticky top-0 z-30 shrink-0 w-full"
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="flex items-center justify-between px-4" style={{ height: "52px" }}>
          {/* left: back to home */}
          <Link
            href="/"
            className="w-10 h-10 rounded-full flex items-center justify-center no-underline active:scale-90 transition-all duration-150"
            style={{ color: "#4b5563", background: "rgba(0,0,0,0.04)" }}
            title="返回主页"
          >
            <ChevronLeft width={18} height={18} />
          </Link>

          {/* center: title */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
            >
              <SparkleIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-semibold" style={{ color: "#1f2937" }}>AI 助手</span>
          </div>

          {/* right: history */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all duration-150"
            style={{ color: "#4b5563", background: "rgba(0,0,0,0.04)" }}
            title="聊天记录"
          >
            <Clock width={18} height={18} />
          </button>
        </div>
        {/* bottom border */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)" }} />
      </header>

      {/* ─── Messages Area ─── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-5 space-y-5"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Welcome screen */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center pt-16 pb-6 px-2">
            {/* logo */}
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6366f1, #3b82f6)",
                boxShadow: "0 12px 36px rgba(124,58,237,0.25), 0 4px 12px rgba(124,58,237,0.15)",
              }}
            >
              <SparkleIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1.5" style={{ color: "#111827" }}>
              你好，我是 AI 助手 ✨
            </h2>
            <p className="text-sm mb-10" style={{ color: "#9ca3af" }}>有什么可以帮到你的？</p>
            <div className=" flex flex-wrap gap-2 justify-evenly mt-2.5">
              {suggestQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-left px-6 py-6 rounded-2xl text-[13px] leading-snug active:scale-[0.96] transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    color: "#374151",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mr-2.5 mt-0.5"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
              >
                <SparkleIcon className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className="max-w-[78%] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap"
              style={
                msg.role === "user"
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #6366f1, #3b82f6)",
                      color: "#fff",
                      borderRadius: "20px 20px 6px 20px",
                      boxShadow: "0 4px 16px rgba(124,58,237,0.2)",
                    }
                  : {
                      background: "#fff",
                      color: "#374151",
                      borderRadius: "20px 20px 20px 6px",
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in-up">
            <div
              className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mr-2.5 mt-0.5"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
            >
              <SparkleIcon className="w-4 h-4 text-white" />
            </div>
            <div
              className="px-5 py-3.5"
              style={{
                background: "#fff",
                borderRadius: "20px 20px 20px 6px",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#a78bfa", animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#818cf8", animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#60a5fa", animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Stop generating button */}
        {isStreaming && (
          <div className="flex justify-center pt-1">
            <button
              onClick={stopStreaming}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium active:scale-95 transition-all duration-200"
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#6b7280",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Stop width={14} height={14} />
              停止生成
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Area ─── */}
      <div
        className="sticky bottom-0 z-20 shrink-0 w-full px-3 pt-2"
        style={{
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          background: "linear-gradient(180deg, transparent 0%, rgba(248,247,255,0.95) 20%, rgba(248,247,255,1) 100%)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-2.5"
          style={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            rows={1}
            className="flex-1 bg-transparent text-[14px] placeholder-gray-400 outline-none resize-none leading-snug py-0.5"
            style={{ color: "#1f2937", maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{
              background: input.trim() && !isStreaming
                ? "linear-gradient(135deg, #7c3aed, #3b82f6)"
                : "rgba(0,0,0,0.06)",
              color: input.trim() && !isStreaming ? "#fff" : "#9ca3af",
              boxShadow: input.trim() && !isStreaming
                ? "0 4px 14px rgba(124,58,237,0.3)"
                : "none",
            }}
          >
            <PaperPlane width={16} height={16} style={{ marginLeft: "2px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
