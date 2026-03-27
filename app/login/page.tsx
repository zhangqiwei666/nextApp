"use client";

import { useState } from "react";
import {Eye, EyeSlash} from "@gravity-ui/icons";
import {Button, FieldError, Form, Input, TextField, InputGroup} from "@heroui/react";
import {userApi} from '../api/login'
import { useRouter } from 'next/navigation';
// import { cookies } from 'next/headers';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    try{
      const {code, data: response} = await userApi.login(data.username, data.password)
      if (code === 200) {
        // 客户端存 localStorage（CSR 使用）
        localStorage.setItem('token', response.token);
        // 同时存 cookie（SSR 使用，服务端通过 cookies() 读取）
        document.cookie = `token=${response.token}; path=/; max-age=${1 * 24 * 3600}`;
        router.push('/')
    }
    }catch(err){
      console.log(err)
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