import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';


dotenv.config();

const dbName = process.env.MONGO_INITDB_DATABASE;
const user = process.env.MONGO_INITDB_ROOT_USERNAME;
const pwd = process.env.MONGO_INITDB_ROOT_PASSWORD;
const collections = process.env.MONGO_COLLECTIONS;

if (!dbName || !user || !pwd) {
  console.error('Environment variables not declared.');

  process.exit(1);
}

let collectionsArray = [];

if (collections) {
  try {
    collectionsArray = JSON.parse(collections);
  } catch (err) {
    console.error('Could not parse MONGO_COLLECTIONS as JSON.');
    process.exit(1);
  }
}

let collectionsScripts = '';

collectionsArray.forEach(collection => {
  collectionsScripts += `db.createCollection('${collection.trim()}');\n`;
});

const template = `db = db.getSiblingDB('${dbName}');
db.createUser({
  user: '${user}',
  pwd: '${pwd}',
  roles: [
    { role: 'readWrite', db: '${dbName}' }
  ],
});

${collectionsScripts}

db = db.getSiblingDB('admin');
db.updateUser('${user}', {
  roles: [
    { role: 'root', db: 'admin' },
    { role: 'dbAdmin', db: '${dbName}' }
  ],
});
`;

try {
  const filePath = path.join(__dirname, 'mongo-init.js');

  fs.writeFileSync(filePath, template);

  console.log('mongo-init.js successfully created.');
} catch (e) {
  console.log('An error occurred while creating mongo-init.js.');
  console.error(e);
}
