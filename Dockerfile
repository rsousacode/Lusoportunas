
FROM ubuntu
RUN apt-get update
RUN apt-get install -y  gnupg  gnupg2  gnupg1
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get update
RUN apt-get install -y mongodb-10gen
RUN mkdir -p /data/db
RUN mkdir -p /setup/
WORKDIR /setup/
COPY ./dc-mongo-setup/create-admin.js .
COPY ./dc-mongo-setup/create-user.js .
EXPOSE 27017
CMD ["--port 27017", "--smallfiles"]
ENTRYPOINT usr/bin/mongod
RUN mongo admin /setup/create-admin.js
RUN mongo myDb /setup/create-user.js -u admin -p admin --authenticationDatabase admin

FROM node:8.11.3
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/
COPY package*.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/
EXPOSE 7217
CMD ["npm","start"]
