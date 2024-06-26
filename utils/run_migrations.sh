#!/bin/bash

DATABASE_NAME=${DATABASE_NAME:-stage}
USERNAME=${USERNAME:-root}
PASSWORD=${PASSWORD:-welcome1}
HOST=${HOST:-172.21.144.1}

for file in ../migration/*.sql
do
    mysql --host=$HOST --user=$USERNAME --password=$PASSWORD $DATABASE_NAME < $file
done