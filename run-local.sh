#!/bin/bash

export MYSQL_HOSTNAME=mysql
export MYSQL_DATABASE=testdb
export MYSQL_USERNAME=root
export MYSQL_PASSWORD=Password123
export MYSQL_PORT=3306

MYSQL_CONTAINER_ID=$(docker run --rm -d -e MYSQL_HOSTNAME=${MYSQL_HOSTNAME} -e MYSQL_DATABASE=${MYSQL_DATABASE} -e MYSQL_USERNAME=${MYSQL_USERNAME} \
    -e MYSQL_ROOT_PASSWORD=${MYSQL_PASSWORD} -p 127.0.0.1:${MYSQL_PORT}:3306/tcp --health-cmd "mysqladmin --protocol=tcp -u root \
    -pPassword123 ping" --health-interval 10s --health-timeout 5s --health-retries 10 mysql:5.7)

source ./run-tests.sh

docker kill ${MYSQL_CONTAINER_ID}
