#!/bin/bash

TEST_DB_NAME=testdb
export TEST_DB_NAME
TEST_DB_USER=root
export TEST_DB_USER
TEST_DB_PORT=3306
export TEST_DB_PORT
TEST_DB_PASSWORD=Password123
export TEST_DB_PASSWORD

MYSQL_CONTAINER_ID=$(docker run --rm -d -e MYSQL_HOSTNAME=mysql -e MYSQL_DATABASE=${TEST_DB_NAME} -e MYSQL_USERNAME=${TEST_DB_USER} \
    -e MYSQL_ROOT_PASSWORD=${TEST_DB_PASSWORD} -p 127.0.0.1:${TEST_DB_PORT}:3306/tcp --health-cmd "mysqladmin -u root \
    -pPassword123 ping" --health-interval 10s --health-timeout 5s --health-retries 10 mysql:5.7)

source ./run-tests.sh

docker kill ${MYSQL_CONTAINER_ID}

