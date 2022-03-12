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

while ! mysqladmin ping --protocol=tcp -u ${TEST_DB_USER} -p{TEST_DB_PASSWORD} --silent 2>/dev/null; do
    sleep 1
done

mysql --protocol=tcp -P${TEST_DB_PORT} -u ${TEST_DB_USER} -p${TEST_DB_PASSWORD} -e "CREATE TABLE ${TEST_DB_NAME}.encryption_key (
          id             VARCHAR(255) NOT NULL,
          created        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          key_record     TEXT         NOT NULL,
          PRIMARY KEY (id, created),
          INDEX (created)
        );" 2>/dev/null

./node_modules/.bin/cucumber-js features/encrypt.feature

# Simulate other platforms
cp node_encrypted java_encrypted
cp node_encrypted csharp_encrypted
cp node_encrypted go_encrypted
cp node_encrypted sidecar_go_encrypted
cp node_encrypted sidecar_java_encrypted

./node_modules/.bin/cucumber-js features/decrypt.feature

rm node_encrypted java_encrypted csharp_encrypted go_encrypted sidecar_go_encrypted sidecar_java_encrypted

docker kill ${MYSQL_CONTAINER_ID}
