db = db.getSiblingDB('${dbName}');
db.createUser({
  user: '${user}',
  pwd: '${pwd}',
  roles: [
    {
      role: 'readWrite',
      db: '${dbName}',
    },
  ],
});
