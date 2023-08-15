FROM amazon/aws-lambda-nodejs:16
WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json ./
RUN npm install --only=production --registry https://registry.npmjs.org
COPY index.js ./
COPY script.sql ./

CMD [ "index.handler" ]
