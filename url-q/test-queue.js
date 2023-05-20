require('dotenv').config();
const amqp = require('amqplib');
const queueName = process.env.URL_QUEUE_NAME;


async function publishToQueue() {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_PORT}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const pattern = 'test';
            const data = [ 1, 2, 3 ];

            channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify({ pattern, data })),
                { persistent: false },
            );
            console.log(`Message sent, pattern: ${pattern}, data: ${data}`);
        }, i * 6000);
    }

    setTimeout(() => {
        connection.close();
    }, 20000);
}

publishToQueue().catch(console.error);
