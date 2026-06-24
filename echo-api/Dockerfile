FROM node:22-alpine
RUN mkdir -p /app
WORKDIR /app
ADD . /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
ENV NODE_ENV=development
EXPOSE 3000 80
CMD ["npm", "run", "start"]