# 1. Basis-Image
FROM node:18-alpine

# 2. Arbeitsverzeichnis
WORKDIR /app

# 3. Abhängigkeiten kopieren & installieren
COPY package*.json ./
RUN npm ci

# 4. Restlichen Code kopieren
COPY . .

# 5. Container-Startbefehl
CMD ["npm", "run", "build"]