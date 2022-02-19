[![Build Status](https://build.premiersupremos.online/api/badges/garydmcdowell1/ps-back/status.svg)](https://build.premiersupremos.online/garydmcdowell1/ps-back)

# Overview

api is an api gateway written in node and based upon clean architecture principles.

It's designed deliberately as a monolith that could be equally separated into distributed services in a blink of an eye because of the clean architecture 'bit'

This services fastify (https://www.fastify.io/) as a framework to keep it squeaky fast.

### Requirements

Install Node 12.13.1

For nvm users, just move to the project directory and run :
```
    nvm i
```
If you already have installed Node 10.16.0 before, just type:
```
    nvm use
```
## Run it
```
npm run start:dev
or
npm run start:prod
```

You can find the auto generated swagger documentation by default with http://localhost:5000/doc

### Testing

You can import the postman collection file ps.postman_collection.json in order to test the public facing APIs

