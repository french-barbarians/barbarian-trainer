#!/bin/bash

# Start Ollama in the background
ollama serve &

# Wait for Ollama to start
sleep 5

# Download Ollama model
if ! ollama pull thewhitewizard/teddy; then
    exit 0
fi

node /app/src/app.js &
IAPP_PID=$!

sleep 50m

kill $ELIZA_PID 2>/dev/null

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