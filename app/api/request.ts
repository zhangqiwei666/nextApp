// ============================================================
// 🔧 Next.js API 请求封装
// 统一处理：基础路径、错误处理、超时、拦截器、TypeScript 类型
// 同时适配 客户端组件（CSR）和 服务端组件（SSR）
// ============================================================

import { redirect } from 'next/navigation';


// ==================== 类型定义 ====================

/** 请求配置 */
interface RequestConfig extends Omit<RequestInit, 'body'> {
  /** 请求超时时间（毫秒），默认 10000 */
  timeout?: number;
  /** 请求参数（GET 时拼接到 URL，POST/PUT 时作为 body） */
  params?: Record<string, string | number | boolean>;
  /** 请求体（POST/PUT/PATCH） */
  body?: unknown;
  /** 是否显示错误提示，默认 true */
  showError?: boolean;
  /** 自定义基础路径，覆盖默认值 */
  baseURL?: string;
}

/** 拦截器 */
interface Interceptors {
  request: ((url: string, config: RequestInit) => [string, RequestInit])[];
  response: ((response: Response) => Response | Promise<Response>)[];
}

// ==================== 核心配置 ====================

/**
 * 获取基础 URL
 * - 客户端组件（浏览器环境）：使用相对路径 ''，浏览器会自动拼接当前域名
 * - 服务端组件（Node.js 环境）：必须使用完整 URL，因为没有浏览器上下文
 */
function getBaseURL(): string {
  // 服务端环境：需要完整 URL
  if (typeof window === 'undefined') {
    return process.env.BACKEND_URL || 'http://localhost:3005';
  }
  // 客户端环境：使用相对路径（浏览器自动处理）
  return '';
}

// 拦截器注册表
const interceptors: Interceptors = {
  request: [],
  response: [],
};

// ==================== 核心请求方法 ====================

async function request<T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    timeout = 10000,
    params,
    body,
    showError = true,
    baseURL,
    headers: customHeaders,
    ...restConfig
  } = config;

  // 1. 拼接完整 URL
  const base = baseURL ?? getBaseURL();
  // 服务端直连后端时，去掉 /api 前缀（BACKEND_URL 在生产环境已包含 /api）
  const normalizedUrl = (typeof window === 'undefined' && !baseURL && url.startsWith('/api'))
    ? url.replace(/^\/api/, '')
    : url;
  let fullUrl = `${base}${normalizedUrl}`;

  // 2. 处理 GET 请求的查询参数
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  // 3. 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  // 4. 如果有 token，自动添加 Authorization 头
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // 5. 构建最终的 fetch 配置
  let fetchConfig: RequestInit = {
    ...restConfig,
    headers,
  };

  // 6. 处理请求体
  if (body !== undefined) {
    fetchConfig.body = JSON.stringify(body);
  }

  // 7. 执行请求拦截器
  for (const interceptor of interceptors.request) {
    [fullUrl, fetchConfig] = interceptor(fullUrl, fetchConfig);
  }

  // 8. 超时控制
  const controller = new AbortController();
  fetchConfig.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let response = await fetch(fullUrl, fetchConfig);
    clearTimeout(timeoutId);

    // 9. 执行响应拦截器
    for (const interceptor of interceptors.response) {
      response = await interceptor(response);
    }

    // 10. HTTP 状态码错误处理
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status,
        (errorData as { message?: string }).message || response.statusText,
        errorData
      );
    }

    // 11. 解析响应
    const data = await response.json();
    
    // 12. 如果后端返回了统一的 { code, data, message } 结构
    //     可以在这里统一处理业务错误码
    if (data && typeof data === 'object' && 'code' in data) {
      if(data.code === 401){
          redirect('/login')
      } else if (data.code !== 200) {
        throw new BusinessError(data.code, data.message, data.data);
      }
      // 返回完整响应对象（调用方的泛型    应为完整响应类型，如 HotTopicsResponse）
      return data as T;
    }

    // 13. 如果后端直接返回数据（没有统一包装），直接返回
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof HttpError || error instanceof BusinessError) {
      if (showError) {
        console.error(`[Request Error] ${error.message}`);
      }
      throw error;
    }

    // 超时错误
    if (error instanceof DOMException && error.name === 'AbortError') {
      const timeoutError = new HttpError(408, `请求超时（${timeout}ms）: ${url}`);
      if (showError) console.error(`[Request Timeout] ${url}`);
      throw timeoutError;
    }

    // 网络错误
    const networkError = new HttpError(0, `网络错误: ${(error as Error).message}`);
    if (showError) console.error(`[Network Error] ${url}`, error);
    throw networkError;
  }
}

// ==================== 错误类型 ====================

/** HTTP 错误（4xx / 5xx） */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** 业务错误（后端返回的 code 非成功） */
export class BusinessError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

// ==================== 快捷方法 ====================

const http = {
  /** GET 请求 */
  get<T = unknown>(url: string, params?: Record<string, string | number | boolean>, config?: RequestConfig) {
    return request<T>(url, { ...config, method: 'GET', params });
  },

  /** POST 请求 */
  post<T = unknown>(url: string, body?: unknown, config?: RequestConfig) {
    return request<T>(url, { ...config, method: 'POST', body });
  },

  /** PUT 请求 */
  put<T = unknown>(url: string, body?: unknown, config?: RequestConfig) {
    return request<T>(url, { ...config, method: 'PUT', body });
  },

  /** PATCH 请求 */
  patch<T = unknown>(url: string, body?: unknown, config?: RequestConfig) {
    return request<T>(url, { ...config, method: 'PATCH', body });
  },

  /** DELETE 请求 */
  delete<T = unknown>(url: string, config?: RequestConfig) {
    return request<T>(url, { ...config, method: 'DELETE' });
  },

  // ==================== SSR 专用方法 ====================

  /** 
   * 服务端组件专用 GET 请求
   * 自动添加 cache 控制，适合 Server Component
   */
  ssrGet<T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean>,
    options?: {
      /** 'no-store' 动态渲染 | 'force-cache' 静态渲染 | number 秒数（ISR） */
      revalidate?: 'no-store' | 'force-cache' | number;
    }
  ) {
    const { revalidate = 'no-store' } = options || {};
    
    const fetchConfig: RequestConfig = {
      method: 'GET',
      params,
    };

    if (revalidate === 'no-store') {
      fetchConfig.cache = 'no-store';
    } else if (revalidate === 'force-cache') {
      fetchConfig.cache = 'force-cache';
    } else {
      fetchConfig.next = { revalidate } as NextFetchRequestConfig;
    }

    return request<T>(url, fetchConfig);
  },

  // ==================== 拦截器管理 ====================

  /** 添加请求拦截器 */
  useRequestInterceptor(fn: (url: string, config: RequestInit) => [string, RequestInit]) {
    interceptors.request.push(fn);
  },

  /** 添加响应拦截器 */
  useResponseInterceptor(fn: (response: Response) => Response | Promise<Response>) {
    interceptors.response.push(fn);
  },
};

export default http;

// ==================== 使用示例（注释） ====================

/*
========================================
📌 示例 1：客户端组件（CSR）中使用
========================================

"use client";
import http from '@/app/lib/request';

interface HotTopic {
  id: number;
  title: string;
  heat: number;
}

export default function MyPage() {
  const [topics, setTopics] = useState<HotTopic[]>([]);

  useEffect(() => {
    // GET 请求
    http.get<{ topics: HotTopic[] }>('/api/hot-topics')
      .then(data => setTopics(data.topics))
      .catch(err => console.error(err));

    // 带查询参数的 GET
    http.get('/api/search', { keyword: 'nextjs', page: 1 });

    // POST 请求
    http.post('/api/posts', { title: '新文章', content: '内容...' });

    // DELETE 请求
    http.delete('/api/posts/123');
  }, []);
}

========================================
📌 示例 2：服务端组件（SSR）中使用
========================================

import http from '@/app/lib/request';

export default async function DiscoverPage() {
  // 动态渲染（每次请求都获取最新数据）
  const data = await http.ssrGet<{ topics: HotTopic[] }>(
    '/api/hot-topics',
    undefined,
    { revalidate: 'no-store' }
  );

  // ISR 模式（每 60 秒重新验证）
  const cachedData = await http.ssrGet<{ topics: HotTopic[] }>(
    '/api/hot-topics',
    undefined,
    { revalidate: 60 }
  );

  // 静态渲染（构建时获取，永不更新）
  const staticData = await http.ssrGet<{ topics: HotTopic[] }>(
    '/api/hot-topics',
    undefined,
    { revalidate: 'force-cache' }
  );

  return <div>{data.topics.map(t => <p key={t.id}>{t.title}</p>)}</div>;
}

========================================
📌 示例 3：请求拦截器（如添加多语言头）
========================================

// 在 layout.tsx 或入口文件中注册
http.useRequestInterceptor((url, config) => {
  const headers = new Headers(config.headers);
  headers.set('Accept-Language', 'zh-CN');
  return [url, { ...config, headers }];
});

========================================
📌 示例 4：响应拦截器（如自动刷新 token）
========================================

http.useResponseInterceptor(async (response) => {
  if (response.status === 401) {
    // token 过期，跳转登录
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  return response;
});

========================================
📌 示例 5：代理到外部后端（配合 rewrites 使用）
========================================

// next.config.ts 中已配置:
// source: '/api/backend/:path*'
// destination: 'http://192.168.31.225:8080/:path*'

// 前端代码只需要写代理路径：
http.get('/api/backend/users');          // → 实际请求 http://192.168.31.225:8080/users
http.post('/api/backend/users', { ... }); // → 实际请求 http://192.168.31.225:8080/users

*/
