"use client";

import { useState } from "react";
import {Eye, EyeSlash} from "@gravity-ui/icons";
import {Button, FieldError, Form, Input, TextField, InputGroup, toast} from "@heroui/react";
import {userApi} from '@/api/login';
import { HttpError} from '@/api/request';
import { userInfoStore } from '@/store/user';

// import { cookies } from 'next/headers';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
    // 获取 setInfo 方法
  const setInfo = userInfoStore((state) => state.setInfo);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userInfo: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      userInfo[key] = value.toString();
    });
    try {
      const { code, data } = await userApi.login(userInfo.username, userInfo.password);
      if (code === 200) {
        setInfo(data.user)
        // 客户端存 localStorage（CSR 使用）
        localStorage.setItem('token', data.token || '');
        // 同时存 cookie（SSR 使用，服务端通过 cookies() 读取）
        document.cookie = `token=${data.token}; path=/; max-age=${1 * 24 * 3600}`;
        
        // 解析鉴权前的路径并跳转 (支持 redirect / from / callbackUrl 等常见参数名)
        const params = new URLSearchParams(window.location.search);
        let redirectUrl = params.get('redirect') || params.get('from') || params.get('callbackUrl') || '/';
        // 设置store
        // 防御性：如果 redirectURL 恰巧又是 /login 自己，强制跳转到 /，防止在登录页死循环
        if (redirectUrl.startsWith('/login')) {
          redirectUrl = '/';
        }

        // 使用 window.location.href 强跳，确保服务端和中间件获取最新 Cookie 并丢弃旧的路由缓存
        window.location.href = redirectUrl;
        return;
      }
    } catch (err) {
      if (err instanceof HttpError && err.status === 402) {
        toast.danger('认证失败：账号密码错误');
        return;
      }
      console.error(err);
    }
  };

  return (
    <Form className="flex w-270px flex-col gap-8 p-5 mt-8!" onSubmit={onSubmit}>
      <TextField
        isRequired
        name="username"
        type="username"
        className="relative pb-5 box-shadow-lg"
        validate={(value) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "请输入正确的账号";
          }

          return null;
        }}
      >
        <Input placeholder="请输入账号" className="h-8 indent-3"/>
        <FieldError className="absolute bottom-[-23] left-0 text-xs text-red-500" />
      </TextField>

      <TextField
        isRequired
        minLength={8}
        name="password"
        type={showPassword ? "text" : "password"}
        className="relative pb-5"
        validate={(value) => {
          if (value.length < 8) {
            return "密码长度不能少于8位";
          }
          if (!/[A-Z]/.test(value)) {
            return "密码必须包含大写字母";
          }
          if (!/[0-9]/.test(value)) {
            return "密码必须包含数字";
          }

          return null;
        }}
      >
        <InputGroup>
          <InputGroup.Input placeholder="请输入密码" className="h-8 indent-3"/>
          <InputGroup.Suffix
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            style={{ marginRight: 5 }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlash width={16} height={16} /> : <Eye width={16} height={16} />}
          </InputGroup.Suffix>
        </InputGroup>
        <FieldError className="absolute bottom-[-23] left-0 text-xs text-red-500" />
      </TextField>

      <div className="flex justify-center align-center">
        <Button type="submit" className="w-lg">
          登录
        </Button>
      </div>
    </Form>
  );
}