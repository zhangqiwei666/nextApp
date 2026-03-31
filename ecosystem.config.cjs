module.exports = {
  apps: [
    {
      name: 'mynextapp',
      script: 'npm',
      args: 'run start',
      cwd: './',
      // 对于 ESM 项目，建议使用 fork 模式（默认），或者通过 npm 启动
      exec_mode: 'fork', 
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3005
      }
    }
  ]
};
