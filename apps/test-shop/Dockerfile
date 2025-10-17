# syntax=docker/dockerfile:1.4

# Base image
FROM node:22-slim AS base

# Set up PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_BUILDER_IO_PUBLIC_KEY

WORKDIR /app

# Enable corepack & install turbo globally
RUN corepack enable
RUN pnpm i -g turbo

# Copy everything (you may optimize this in multi-stage builds)
COPY . .

# Prune for Docker
RUN turbo prune @shopnex/shop --docker

# Restore and cache node_modules + turbo cache
RUN pnpm install --frozen-lockfile

# Build with turbo and cache
RUN pnpm turbo run build --filter=@shopnex/shop

WORKDIR /app/apps/shop

CMD ["pnpm", "start"]

