FROM node:18-aline

WORKDIR /app

COPY package*.json ./

RUN npm install --omt=dev

COPY . .

USER node

EXPOSE 8070

CMD [ "npm", "run", "start"]