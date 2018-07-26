
#!/bin/sh
docker-compose down
docker-compose up -d
sleep 1
docker exec lusodb  mongo admin ./setup/create-admin.js
docker exec lusodb  mongo myDb ./setup/create-user.js -u d7h1622 -p Qca96XF3RroUTck54wdkVVgxfww --authenticationDatabase admin
