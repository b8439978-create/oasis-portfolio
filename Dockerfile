FROM node:20-alpine AS frontend
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir gunicorn
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ backend/
COPY --from=frontend /build/out/ out/
WORKDIR /app/backend
EXPOSE 5000
CMD gunicorn server:app -b 0.0.0.0:${PORT:-5000} --timeout 120 --workers 2
