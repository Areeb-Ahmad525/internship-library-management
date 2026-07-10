FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./

RUN if [ -f package.json ]; then npm install; fi

COPY frontend/ .


EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
#CMD ["npm", "start"]
#for vite
#CMD ["npm", "run", "dev", "--", "--host"]

