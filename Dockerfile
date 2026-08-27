# ==============================================================================
#  Multi-Stage Dockerfile for NudgeBuddy (Ultra-lightweight Nginx container)
# ==============================================================================

# Stage 1: Build the Vite + TypeScript frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with high-performance Alpine Nginx (Size: ~25MB)
FROM nginx:alpine

# Copy custom Nginx configuration for single-page apps
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
