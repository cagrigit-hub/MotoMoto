module.exports = {
    apps: [
      {
        max_restarts: 10, // Maximum number of restarts within 60 seconds
        min_uptime: 10000, // Minimum uptime (in milliseconds) before considering the process "online"
        time: true, // Prefix log entries with timestamps
        name: "moto-moto-listener",
        script: "./build/src/index.js",
        cwd: "./",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        log_date_format: "YYYY-MM-DD HH:mm:ss", // Format for timestamps in logs
        error_file: "./logs/error.log", // Path to error log file
        out_file: "./logs/out.log", // Path to out log file
        merge_logs: true, // Merge error and out logs into a single file
      },
    ],
  };
  