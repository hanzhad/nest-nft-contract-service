FROM node:16
WORKDIR /app
COPY package*.json ./
RUN rm -drf .env
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]
