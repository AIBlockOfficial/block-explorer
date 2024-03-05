FROM cgr.dev/chainguard/node@sha256:4a8f2fb37f0d2b34460f1a86f106c504954917561a50af1fa310f615709079d1 as build

WORKDIR /app

# Copy and build dependancies first
COPY package.json postcss.config.js tailwind.config.ts tsconfig.json next.config.js ./
RUN npm install

# Copy and build for release
COPY . .
RUN npm run build

# Use distroless
#FROM cgr.dev/chainguard/nginx@sha256:3dd8fa303f77d7eb6ce541cb05009a5e8723bd7e3778b95131ab4a2d12fadb8f
FROM cgr.dev/chainguard/node@sha256:4a8f2fb37f0d2b34460f1a86f106c504954917561a50af1fa310f615709079d1

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

ENTRYPOINT ["npm"]
CMD ["run", "start"]