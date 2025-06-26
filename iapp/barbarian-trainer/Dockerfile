FROM frederic1206/teddy:3b
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
 
ENTRYPOINT ["/bin/bash", "entrypoint.sh"]