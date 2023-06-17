import { config } from 'dotenv';
import { createClient } from 'redis';


config();

const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

await client.connect();

client.sendCommand(['flushdb'], function(err, succeeded) {
    if (err) {
        console.log('An error occurred:');
        console.error(err);
    }

    console.log(succeeded);

    client.on('end', function() {
        console.log('Redis client disconnected');
        process.exit(0);
    });

    client.disconnect();
});
