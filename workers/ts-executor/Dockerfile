# ---- Build Stage ----
FROM node:20-alpine AS build

# First copy only what's needed for dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy backend as a dependency (only what's needed for types)
COPY ../../backend/package.json ./backend/
COPY ../../backend/prisma ./backend/prisma
COPY ../../backend/tsconfig.json ./backend/
RUN cd backend && npm install --only=dev && npx prisma generate

# Now copy the rest of the application
COPY ../../backend/src ./backend/src
COPY . .

# Build the application
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy built files and production dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY .env .

CMD ["node", "dist/index.js"]