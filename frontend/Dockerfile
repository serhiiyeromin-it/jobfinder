# Build-Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # legt resultate in /app/dist ab

# Runtime-Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve           # leichtgewichtiger Static-Server
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
