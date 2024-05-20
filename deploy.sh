#!/bin/bash

cd /home/ubuntu/app

# Check if the postgres container is running
if docker ps | grep -q postgres; then
  echo "Postgres container is already running."
else
  echo "Postgres container is not running. Starting docker-compose services..."
  docker-compose up -d
fi

container_id_frontend=$(docker ps -q --filter ancestor=hoppscotch/hoppscotch-frontend)
if [ -n "$container_id_frontend" ]; then
  echo "Container with image hoppscotch/hoppscotch-frontend is running. Stopping the container..."
  docker stop "$container_id_frontend"
else
  echo "No running container with image hoppscotch/hoppscotch-frontend found."
fi
docker run -d -p 3000:3000 --env-file .env --network app_hoppscotch-network --restart unless-stopped hoppscotch/hoppscotch-frontend

container_id_backend=$(docker ps -q --filter ancestor=hoppscotch/hoppscotch-backend)
if [ -n "$container_id_backend" ]; then
  echo "Container with image hoppscotch/hoppscotch-backend is running. Stopping the container..."
  docker stop "$container_id_backend"
else
  echo "No running container with image hoppscotch/hoppscotch-backend found."
fi
docker run -d -p 3170:3170 --env-file .env --network app_hoppscotch-network --restart unless-stopped hoppscotch/hoppscotch-backend

container_id_admin=$(docker ps -q --filter ancestor=hoppscotch/hoppscotch-admin)
if [ -n "$container_id_admin" ]; then
  echo "Container with image hoppscotch/hoppscotch-admin is running. Stopping the container..."
  docker stop "$container_id_admin"
else
  echo "No running container with image hoppscotch/hoppscotch-frontend found."
fi
docker run -d -p 3100:3100 --env-file .env --network app_hoppscotch-network --restart unless-stopped hoppscotch/hoppscotch-admin
