FROM node:latest
ENV NODE_ENV=development
COPY . /var/www
WORKDIR /var/www
RUN npm install 
RUN npx prisma generate
#RUN npx prisma migrate dev zenvia
ENTRYPOINT ["npm","run", "start:dev"]
EXPOSE 3000