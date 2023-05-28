const execShPromise2 = require('exec-sh').promise;

const runConf = async () => {
  try {
    const out = await execShPromise2(`docker exec -i bazaraki-data-storage-mongo-rs mongosh --username ${process.env.MONGO_INITDB_ROOT_USERNAME} --password ${process.env.MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin --port ${process.env.MONGO_PORT} --eval "rs.conf()"`, true);

    console.log(out.stdout);
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', e.stderr);
    console.log('Stdout: ', e.stdout);

    return e;
  }
};

runConf();
