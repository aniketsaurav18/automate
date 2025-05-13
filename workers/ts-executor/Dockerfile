# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# 1. Copy only package files first for better caching
COPY workers/ts-executor/package*.json ./
RUN npm install

# 2. Copy backend as a dependency
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma
COPY backend/tsconfig.json ./backend/
RUN cd backend && npm install --only=dev && npx prisma generate

# 3. Copy remaining source files
COPY backend/src ./backend/src
COPY workers/ts-executor ./workers/ts-executor

# 4. Build the application
RUN cd workers/ts-executor && npm run build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary production files
COPY --from=build /app/workers/ts-executor/dist ./dist
COPY --from=build /app/workers/ts-executor/node_modules ./node_modules
COPY --from=build /app/backend/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/workers/ts-executor/index.js"]