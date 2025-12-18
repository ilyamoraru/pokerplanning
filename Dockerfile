# Stage 1: Build the Nuxt application
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:24-alpine AS final
WORKDIR /app
COPY --from=build /app/.output /app/.output
COPY --from=build /app/package*.json ./
COPY --from=build /app/nuxt.config.ts ./
# If you have a static directory, copy it too
COPY --from=build /app/public ./public

# Install only production dependencies
RUN npm install --production

# Expose port 3000
EXPOSE 3000

# Set environment variable required for Docker
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", "./.output/server/index.mjs"]
