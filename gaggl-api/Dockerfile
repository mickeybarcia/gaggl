FROM node:14 as prod

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD [ "node", "src/server.js" ]

FROM prod as dev

EXPOSE 8080

ENV NODE_ENV=development

RUN npm install -g nodemon

RUN npm install --only=dev

# TODO: run seperate dev server
CMD [ "node", "src/server.js" ]   