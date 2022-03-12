#!/bin/bash

while ! mysqladmin ping --protocol=tcp -u ${MYSQL_USER} -p{MYSQL_PASSWORD} --silent 2>/dev/null; do
    sleep 1
done

mysql --protocol=tcp -P 3306 -u ${MYSQL_USERNAME} -p${MYSQL_PASSWORD} -e "CREATE TABLE ${MYSQL_DATABASE}.encryption_key (
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
