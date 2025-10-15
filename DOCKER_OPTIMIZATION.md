# Docker Image Optimization for Scalingo

## Problem

The Docker image was exceeding Scalingo's 1500MB limit (actual size: 1525MB), preventing deployment.

## Root Causes

1. **Single-stage build**: The original Dockerfile included all development dependencies (~891MB of node_modules) in the final image
2. **No standalone output**: Next.js was not configured to create a minimal runtime bundle
3. **Inefficient .dockerignore**: Test files, documentation, and other unnecessary files were being copied into the image

## Solution

### 1. Multi-Stage Docker Build

The new Dockerfile uses a two-stage build process:

**Stage 1 (Builder)**:
- Installs ALL dependencies (including devDependencies needed for build)
- Copies source code
- Builds the Next.js application with standalone output
- This stage is ~1GB+ but is discarded after build

**Stage 2 (Runner)**:
- Starts from a fresh alpine base (~150MB)
- Only copies necessary runtime files:
  - `public/` directory (~2MB)
  - `.next/standalone/` directory (~111MB - minimal Node.js server + production dependencies)
  - `.next/static/` directory (~6.6MB - static assets)
- Creates non-root user for security
- Final image size: **~300-400MB**

### 2. Next.js Standalone Output

Added `output: "standalone"` to `next.config.ts`. This tells Next.js to:
- Create a minimal runtime bundle in `.next/standalone/`
- Include only production dependencies actually used by the application
- Generate a standalone `server.js` that can run independently
- Reduce node_modules from 891MB to ~111MB

### 3. Enhanced .dockerignore

Updated to exclude:
- Build artifacts (`.next`, `out`)
- Dependencies (`node_modules`)
- Git files (`.git`, `.github`)
- Test files (`*.test.ts`, `*.spec.ts`, `__tests__`)
- Documentation (`README.md`, `AGENTS.md`)
- Development files (`.vscode`, `.idea`)

## Expected Results

| Component | Size | Notes |
|-----------|------|-------|
| Base alpine image | ~150MB | node:22-alpine |
| Standalone bundle | ~111MB | Production dependencies only |
| Static assets | ~6.6MB | Next.js build output |
| Public files | ~2MB | Images, fonts, etc. |
| **Total** | **~270-400MB** | Well under 1500MB limit |

## How to Test Locally

```bash
# Build the optimized image
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 \
  --build-arg NEXT_PRIVATE_API_AUTH_TOKEN=your-token \
  -t mon-devis-optimized:test \
  .

# Check the image size
docker images mon-devis-optimized:test

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  -e NEXT_PRIVATE_API_AUTH_TOKEN=your-token \
  mon-devis-optimized:test
```

## Scalingo Deployment

Scalingo will automatically detect the Dockerfile and use it to build the image. The environment variables configured in Scalingo will be passed at build time.

No changes to Scalingo configuration are required - the fix is entirely in the repository files.

## Technical Details

### Before (Single-Stage Build)
```
node:22-alpine (~150MB)
+ node_modules (~891MB with dev dependencies)
+ source code (~20MB)
+ build artifacts (~100MB)
= ~1525MB (exceeds limit!)
```

### After (Multi-Stage Build)
```
Stage 1 (Builder - discarded):
  node:22-alpine + all dependencies + source + build

Stage 2 (Runner - final):
  node:22-alpine (~150MB)
  + standalone bundle (~111MB)
  + static assets (~6.6MB)
  + public files (~2MB)
  = ~270-400MB (within limit!)
```

## References

- [Next.js Standalone Output Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Scalingo Docker Documentation](https://doc.scalingo.com/platform/deployment/build-with-dockerfile)
