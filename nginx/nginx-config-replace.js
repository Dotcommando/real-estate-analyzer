require('dotenv').config();


const fs = require('fs');
const nginxConfigPath = '/etc/nginx/nginx.conf';
const configRaw = fs.readFileSync(nginxConfigPath, 'utf8');
const configNew = configRaw
    .replace(/\$\{GATEWAY_PORT\}/g, process.env.GATEWAY_PORT)
    .replace(/\$\{GATEWAY_HOST\}/g, process.env.GATEWAY_HOST)
    .replace(/\$\{FRONT_PORT\}/g, process.env.FRONT_PORT)
    .replace(/\$\{FRONT_HOST\}/g, process.env.FRONT_HOST);

fs.writeFileSync(nginxConfigPath, configNew);
