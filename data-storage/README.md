# Storage for scraped data

**Ports in use**: **27077**.

Port 27077: _Mongo DB_ in Docker.

## How to run

**First of all**, rename files `.env.example` to `.env`.

```bash
# Up container with database with creds and collections
$ npm start
```

The command creates dist/mongo-init.js with variables from .env file. After that it runs docker-compose.

There is folder mongodb/db which used as volume for docker-compose, so after containers are stopped and ran again with another creds, the content in the DB is the same as before.

### Stop with database information saving

```bash
# Stop the container, the DB data remain in mongodb/db
$ npm run db:stop
```

### Keep in mind

Command `npm run db:up` expects file `dist/mongo-init.js` exists and contains scripts for creating DB and collections. Normally it creates by `dist/generate-mongo-init.js` file.
