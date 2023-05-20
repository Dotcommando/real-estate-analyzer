require('dotenv').config();
const amqp = require('amqplib');
const queueName = process.env.URL_QUEUE_NAME;
const mockUrls = [
    'http://localhost:3000/adv/4524513_5-bedroom-detached-house-to-rent/',
    'http://localhost:3000/adv/4659324_2-bedroom-detached-house-to-rent/',
    'http://localhost:3000/adv/4539260_5-bedroom-villa-to-rent/',
    'http://localhost:3000/adv/4607461_5-bedroom-detached-house-to-rent/',
    'http://localhost:3000/adv/4354567_6-bedroom-villa-to-rent/',
];

async function publishToQueue() {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_PORT}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const pattern = 'test';
            const data = [ mockUrls[i] ];

            channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify({ pattern, data })),
                { persistent: false },
            );
            console.log(`Message sent, pattern: ${pattern}, data: ${data}`);
        }, i * 3000);
    }

    setTimeout(() => connection.close(), 10000);
}

publishToQueue().catch(console.error);
