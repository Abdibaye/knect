# Use an official Node.js image as base
FROM node:18-alpine AS build

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only package.json and pnpm-lock.yaml first for dependency caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN pnpm run build

# Prepare production image
FROM node:18-alpine AS runtime

# Install pnpm for runtime image
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built files and public assets from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000
USER node

CMD ["pnpm", "start"]
