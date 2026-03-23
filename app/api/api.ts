// ============================================================
// 📡 API 接口定义 — 按模块组织
// 所有接口调用集中管理，方便维护和复用
// ============================================================

import http from './request';

// ==================== 类型定义 ====================

export interface HotTopic {
  id: number;
  rank: number;
  title: string;
  description: string;
  image: string;
  heat: number;
  tag?: string;
  isNew?: boolean;
  isHot?: boolean;
}

export interface HotTopicsResponse {
  data: HotTopic[];
  message: string;
  code: number;
}

// ==================== 热搜相关接口 ====================

export const hotTopicsApi = {
  /** 获取热搜列表（客户端调用） */
  getTopics() {
    return http.get<HotTopicsResponse>('/api/discover/list');
  },

  /** 获取热搜列表（服务端 SSR，每次动态获取） */
  getTopicsSSR() {
    return http.ssrGet<HotTopicsResponse>('/api/discover/list', undefined, {
      revalidate: 'no-store',
    });
  },

  /** 获取热搜列表（ISR 模式，每 60 秒刷新） */
  getTopicsISR(seconds = 60) {
    return http.ssrGet<HotTopicsResponse>('/api/hot-topics', undefined, {
      revalidate: seconds,
    });
  },
};

// ==================== 用户相关接口（示例） ====================

/*
export interface User {
  id: number;
  name: string;
  avatar: string;
}

export const userApi = {
  // 获取用户信息
  getProfile() {
    return http.get<User>('/api/user/profile');
  },

  // 更新用户信息
  updateProfile(data: Partial<User>) {
    return http.put<User>('/api/user/profile', data);
  },

  // 登录
  login(username: string, password: string) {
    return http.post<{ token: string }>('/api/auth/login', { username, password });
  },
};
*/

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
