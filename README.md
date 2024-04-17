# Acore Quick Registration
This is a simple regisration page for Azeroth Core. It is solely to create accounts and no other functionality is included.

Support: [AzerothCore](https://www.azerothcore.org/)

## Requirements
Docker and docker-compose.

## Installation
- Clone the repository
- Open docker-compose.yml and change the environment variables to the ones for your server.
```docker
    - DB_HOST=127.0.0.1 (local or remote IP address of your database server)
    - DB_PORT=3306 (port of your database server)
    - DB_USER=root (username for your database server)
    - DB_PASSWORD=password (password for your database server)
    - DB_DATABASE=acore_auth (name of the database)
    - REALMLIST=realmlist1.example.com,realmlist2.example.com (comma separated list of realmlist addresses)
```
- run `docker-compose up -d` to start the server
- Open http://localhost:3030/ with your browser to see the page.