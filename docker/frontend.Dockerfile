FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./
FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./

RUN if [ -f package.json ]; then npm install; fi

COPY frontend/ .


EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
#CMD ["npm", "start"]
#for vite
#CMD ["npm", "run", "dev", "--", "--host"]
