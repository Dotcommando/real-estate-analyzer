# Storage for scraped data

**Ports in use**: **27077**.

Port 27077: _Mongo DB_ in Docker in replica set mode.

## How to run

**First of all**, rename files `.env.example` to `.env`.

```bash
# users
$ cd data-storage
$ npm i
$ npm run generate:key
$ npm run db:up
$ npm run rs:init
```
