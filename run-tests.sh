#!/bin/bash

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

