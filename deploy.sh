#!/bin/bash

cd /home/ubuntu/app

echo Stopping any existing containers...
docker-compose down

echo Pulling the latest images...
docker-compose pull

echo Starting the application...
docker-compose up -d

docker run -d -p 3000:3000 --env-file .env --network app_hoppscotch-network --restart unless-stopped hoppscotch/hoppscotch-frontend
docker run -d -p 3170:3170 --env-file .env --network app_hoppscotch-network --restart unless-stopped hoppscotch/hoppscotch-backend
docker run -d -p 3100:3100 --env-file .env --network app_hoppscotch-network --restart unless-stopped hoppscotch/hoppscotch-admin
