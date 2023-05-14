require('dotenv').config();


const amqp = require('amqplib');
const queueName = process.env.URL_QUEUE_NAME;

async function clearQueue() {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_PORT}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);
    await channel.purgeQueue(queueName);
    await connection.close();

    console.log('Queue cleared');
}

clearQueue().catch(console.error);
