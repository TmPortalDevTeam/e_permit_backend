module.exports = {
    apps: [
        {
            name: 'api-v2',
            script: './build/src/index.js',
            time: true,
            kill_timeout: 10000,
            instances: 1,
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'cron-jobs',
            script: './build/src/cron.js',
            time: true,
            kill_timeout: 10000,
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
