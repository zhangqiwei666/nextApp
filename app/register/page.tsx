"use client";

import { useState } from "react";
import {Eye, EyeSlash} from "@gravity-ui/icons";
import {Button, FieldError, Form, Input, TextField, InputGroup, toast} from "@heroui/react";
import {userApi} from '../api/login'
import { HttpError} from '../api/request';
import  "./login.css";
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userInfo: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      userInfo[key] = value.toString();
    });
    if(userInfo.password && userInfo.rePpassword){
      if(userInfo.password !== userInfo.rePpassword){
        toast.danger('两次输入的密码不一致');
        return;
      }
    }
    try {
      const { code } = await userApi.register(userInfo.username, userInfo.password);
      if (code === 200) {
        toast.success('注册成功！即将跳转到登录页...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
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
    <div className="content">
    <div className="login-box">
      <div className="text-2xl font-bold mb-6 flex justify-center mt-4!">用户注册</div>
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
                onChange={setPassword}
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
            <TextField
                isRequired
                minLength={8}
                name="rePpassword"
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
                if (password && value !== password) {
                    return "两次输入的密码不一致";
                }

                return null;
                }}
            >
            <InputGroup>
                <InputGroup.Input placeholder="请再次输入密码" className="h-8 indent-3"/>
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
                注册
                </Button>
            </div>
        </Form>
    </div>
  </div>
  );
}