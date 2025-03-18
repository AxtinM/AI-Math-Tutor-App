module.exports = {
    apps: [
        {
            name: "math-tutor",
            script: "node_modules/.bin/next",
            args: "start",
              interpreter: "/home/attig/.nvm/versions/node/v20.19.0/bin/node", // This should point to your Node.js 20+ installation
            interpreter_args: "--max-http-header-size=16384", // Helps with large header sizes if needed
            time: true, // Add timestamp to logs
            watch: false,
            instances: "1",
            exec_mode: "fork",
            max_memory_restart: "1G",
            restart_delay: 3000
        }
    ]
};
