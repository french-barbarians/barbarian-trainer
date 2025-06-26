#!/bin/bash

# Start Ollama in the background
OLLAMA_ORIGINS=* OLLAMA_HOST=0.0.0.0 ollama serve &

# Wait for Ollama to start
sleep 5

node /app/src/app.js &
IAPP_PID=$!

sleep 50m

kill $IAPP_PID 2>/dev/null

# Kill all Node and Ollama processes
pkill -f node
pkill -f ollama

# Clean up all child processes
kill -- -$$

# Final cleanup with SIGKILL if needed
kill -9 $(pgrep node) 2>/dev/null
kill -9 $(pgrep ollama) 2>/dev/null

# Ensure the script exits
exit 0