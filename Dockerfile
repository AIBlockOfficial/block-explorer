FROM cgr.dev/chainguard/node@sha256:39d19ad5086ede8bc9412e23ec80417c12bf39dfdd175e06eedd82b16527cbeb as build

WORKDIR /app

# Copy and build dependancies first
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy and build for release
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Use distroless
FROM cgr.dev/chainguard/node:latest

ENV NODE_ENV production
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

USER node

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env.development ./.env.development
COPY --from=build /app/.env.staging ./.env.staging
COPY --from=build /app/.env.production ./.env.production
COPY --from=build --chown=node:node /app/public ./public

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["npm run prep && npm start"]