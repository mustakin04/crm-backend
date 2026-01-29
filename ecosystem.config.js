module.exports = {
  /**
   * Application declaration section
   * https://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'crm-backend',
      script: './index.js',
      instances: 1,
      watch: false,
      // allocate 512 MB memory for each instance
      node_args: [
        '--max-old-space-size=512',
      ],
      env_production: {
        PORT: 64690, // https://crm-api.iatlasstudy.com
        PRODUCTION: true,
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * https://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'iatlasstudy',
      host: 'server3074.quanticdynamics.cloud',
      port: '5468',
      ssh_options: 'StrictHostKeyChecking=no',
      ref: 'origin/main',
      repo: 'git@github.com:iatlasstudy/crm-backend.git',
      path: '/mnt/volume_30741/iatlasstudy/deploy/crm-backend/pm2',
      'pre-deploy': 'git fetch --all',
      'post-deploy':
        // eslint-disable-next-line max-len
        'cp -rf /mnt/volume_30741/iatlasstudy/deploy/crm-backend/secrets/.env . && npm install && pm2 startOrReload ecosystem.config.js --env production',
    },
  },
};
