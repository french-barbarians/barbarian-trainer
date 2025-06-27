FROM node:24.3.0-slim


RUN apt-get update &&  apt-get install -y jq sudo curl && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -L https://ollama.com/download/ollama-linux-amd64.tgz -o ollama-linux-amd64.tgz && \
    tar -C /usr -xzf ollama-linux-amd64.tgz && \
    rm ollama-linux-amd64.tgz

RUN ollama serve & \
    OLLAMA_PID=$! && \
    echo "⏳ Attente d'Ollama..." && \
    for i in $(seq 1 30); do \
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then \
    echo "✅ Ollama prêt" && \
    break; \
    fi; \
    echo "  Tentative $i/30..." && \
    sleep 2; \
    done && \
    echo "📦 Téléchargement thewhitewizard/teddy..." && \
    ollama pull thewhitewizard/teddy:3b && \
    echo "✅ Modèle Teddy téléchargé avec succès" && \
    kill $OLLAMA_PID

