# Multi-stage build to reduce final image size
# This approach reduces the image from ~1525MB to under 500MB by:
# 1. Using multi-stage builds to exclude dev dependencies
# 2. Leveraging Next.js standalone output mode
# 3. Only copying necessary runtime files to the final image

# Stage 1: Builder - Install dependencies and build the app
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app with standalone output
# Environment variables will be provided by Scalingo at build time
RUN npm run build

# Stage 2: Runner - Create minimal runtime image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files from builder stage:
# 1. public folder for static assets
# 2. standalone folder (contains minimal Node.js server + dependencies)
# 3. static folder (Next.js build output)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the standalone server created by Next.js
CMD ["node", "server.js"]