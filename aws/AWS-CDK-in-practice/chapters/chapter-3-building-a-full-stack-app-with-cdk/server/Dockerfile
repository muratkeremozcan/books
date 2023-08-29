FROM amd64/node:16

WORKDIR /server

COPY . .

RUN npm install --registry https://registry.npmjs.org && npm run build

EXPOSE 80

ENTRYPOINT ["npm", "run", "start"]