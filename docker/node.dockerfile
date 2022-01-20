FROM node:16.13.1
ENV NODE_ENV=development
COPY . /var/www
WORKDIR /var/www
RUN apt-get update && npm install 
RUN $ wget -qO- https://raw.githubusercontent.com/eficode/wait-for/v2.2.1/wait-for | sh -s -- google.com:80 -- echo success
RUN npx prisma generate
#RUN npx prisma migrate dev zenvia
CMD [ "bash", "./migrate.sh" ]
ENTRYPOINT ["npm","run", "start:dev"]
EXPOSE 3000