
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]

#este se uso para tratar la data a la DB

#FROM node:20

#WORKDIR /app

#COPY package*.json ./
#RUN npm install

#COPY . .

#EXPOSE 4000

#CMD ["tail", "-f", "/dev/null"]