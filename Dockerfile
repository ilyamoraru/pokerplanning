# Stage 1: Build the Nuxt application
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm run build
COPY . .

# Stage 2: Run the application
FROM node:24-alpine AS final
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/nuxt.config.ts ./nuxt.config.ts
COPY --from=build /app/public ./public

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Command to run the application
CMD ["node", "./.output/server/index.mjs"]
#CMD ["sleep", "infinity"]
