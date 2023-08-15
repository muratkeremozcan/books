FROM amazon/aws-lambda-nodejs:14
WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json ./
RUN npm install --registry https://registry.npmjs.org --only=production
COPY index.js ./
COPY script.sql ./

CMD [ "index.handler" ]
