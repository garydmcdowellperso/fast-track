#!/bin/sh

CONTAINER=redpanda-1
RUNNING=$(docker inspect --format="{{.State.Running}}" $CONTAINER 2> /dev/null)

if [ $? -eq 1 ]; then
  echo "Starting kafka"
  docker run -d --pull=always --name=redpanda-1 --rm \
    -p 9092:9092 \
    -p 9644:9644 \
    docker.vectorized.io/vectorized/redpanda:latest \
    --advertise-kafka-addr 127.0.0.1:9092 \
    redpanda start \
    --overprovisioned \
    --smp 1  \
    --memory 1G \
    --reserve-memory 0M \
    --node-id 0 \
    --check=false
else
echo "Stopping kafka"
docker stop redpanda-1
fi