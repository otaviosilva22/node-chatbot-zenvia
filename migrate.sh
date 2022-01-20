#!/bin/bash

while ! nc -z zenvia_db 3306;
do
  echo "INFO: Waiting for database completely start"
  sleep 5s
done
echo "INFO: making migrations"
npx prisma migrate dev zenvia
