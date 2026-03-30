// ============================================================
// 📡 API 接口定义 — 按模块组织
// 所有接口调用集中管理，方便维护和复用
// ============================================================

import http from './request';



export interface Response {
  data: object;
  message: string;
  code: number;
}

interface LoginResponse {
  data: {
    token?: string;
    message?: string;
  };
  message: string;
  code: number;
}   

// ==================== 用户相关接口（示例） ====================

export interface User {
  id: number;
  name: string;
  avatar: string;
}

export const userApi = {
  // 获取用户信息
  getProfile() {
    return http.get<Response>('/api/user/profile');
  },

  // 更新用户信息
  updateProfile(data: Partial<User>) {
    return http.put<Response>('/api/user/profile', data);
  },

  // 登录
  login(username: string, password: string) {
    return http.post<LoginResponse>('/api/login', { username, password });
  },
  register(username: string, password: string) {
    return http.post<LoginResponse>('/api/register', { username, password });
  },
};


// ==================== 代理到外部后端的接口（示例） ====================

/*
// 配合 next.config.ts 中的 rewrites 使用
// source: '/api/backend/:path*' → destination: 'http://backend:8080/:path*'

export const externalApi = {
  // 获取用户列表 → 实际请求: http://backend:8080/users
  getUsers() {
    return http.get<User[]>('/api/backend/users');
  },

  // 创建用户 → 实际请求: http://backend:8080/users
  createUser(data: Partial<User>) {
    return http.post<User>('/api/backend/users', data);
  },
};
*/
