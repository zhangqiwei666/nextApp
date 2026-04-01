"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * 独立的代码块组件，用于处理复制状态
 */
const CodeBlock = ({ language, children }: { language: string; children: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
      {/* 代码块头部 */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1b26] border-b border-gray-700/30 text-gray-400 text-[11px] font-mono">
        <span>{language.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded-md"
        >
          {copied ? (
            <Check size={12} className="text-green-400" />
          ) : (
            <Copy size={12} />
          )}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      {/* 代码内容 */}
      <SyntaxHighlighter
        style={atomDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "13px",
          background: "#1a1b26",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Markdown 渲染组件
 * 支持 GFM (表格/列表)、代码高亮、一键复制
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming }) => {
  return (
    <div className="prose prose-sm max-w-none prose-neutral dark:prose-invert markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义代码块渲染
          code({ inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && match) {
              return (
                <CodeBlock language={match[1]}>
                  {codeString}
                </CodeBlock>
              );
            }

            // 行内代码
            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-gray-100 text-purple-600 font-mono text-[0.9em]"
                {...props}
              >
                {children}
              </code>
            );
          },
          // 优化链接
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-500 hover:underline transition-all"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // 优化表格
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table {...props} className="min-w-full divide-y divide-gray-200" />
            </div>
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          th: ({ node, ...props }) => (
            <th {...props} className="px-4 py-2 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" />
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          td: ({ node, ...props }) => (
            <td {...props} className="px-4 py-2 text-sm text-gray-600 border-t border-gray-50" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {/* 流式光标 - 仅在输出时显示 */}
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-purple-500 animate-pulse rounded-full align-middle mb-0.5" />
      )}
    </div>
  );
};

export default MarkdownRenderer;
