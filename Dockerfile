# Multi-stage build to reduce final image size
# This approach reduces the image from ~1525MB to under 500MB by:
# 1. Using multi-stage builds to exclude dev dependencies
# 2. Leveraging Next.js standalone output mode
# 3. Only copying necessary runtime files to the final image

# Stage 1: Builder - Install dependencies and build the app
FROM node:24-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies needed for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set build-time environment variables for the build process
ENV NEXT_PUBLIC_API_URL=http://host.docker.internal:3001
ENV NEXT_PRIVATE_API_AUTH_TOKEN=dummy_token_for_build

# Build the Next.js app with standalone output
# Environment variables will be provided by Scalingo at build time
RUN pnpm run build

# Stage 2: Development - For local development with hot reload
FROM node:24-alpine AS development
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code (will be overridden by volume mount)
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["pnpm", "run", "dev"]

# Stage 3: Runner - Create minimal runtime image
FROM node:24-alpine AS runner
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