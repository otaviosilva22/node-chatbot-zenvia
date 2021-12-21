# Chatbot para reconhecimento de músicas
Chatbot construído em Node.js para reconhecimento de música. 

Tenha certeza de ter instalado o docker e o docker-compose

desative o mysql do host
```shell
$ sudo service mysql stop
```
### Rode a aplicação

```shell
$ docker-compose build
$ docker-compose up
```
Em outra aba do terminal abra execute o terminal do container zenvia_app

```shell
$ docker container exec -it <container_id | container_name> /bin/sh
```
Dentro do bash do container execute a migration do prisma para gerar a tabela de usuário no banco:
```shell
$ npx prisma migrate dev create_user
                             ^--- nome da migration
```