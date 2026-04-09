import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aiballs.cn';
  const basePath = '/app'; // Matches process.env.NEXT_PUBLIC_BASE_PATH in production

  // Define static routes
  const staticRoutes = [
    '',
    '/aichat',
    '/discover',
    '/discover-csr',
    '/posts',
  ].map((route) => ({
    url: `${baseUrl}${basePath}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Define dynamic post routes based on src/app/posts/page.tsx
  const postRoutes = ['1', '2', '3', '4', '5'].map((id) => ({
    url: `${baseUrl}${basePath}/posts/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
