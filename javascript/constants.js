require('dotenv').config();
const {Pool} = require('pg');
const { Client, GatewayIntentBits, Events } = require('discord.js');

export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    port: 5432
})

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

export const insultingWords = [
    'dumb',
    'stupid',
    'an idiot'
];
// Ryans user id
export const targetUserId = '300683364485038080';