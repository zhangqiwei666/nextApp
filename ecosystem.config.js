module.exports = {
  apps: [
    {
      name: 'mynextapp',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3005',
      cwd: './',
      instances: 'max', // 或者指定具体的倍数，例如 2
      exec_mode: 'cluster', // 开启集群模式，充分利用多核CPU
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005
      }
    }
  ]
};
