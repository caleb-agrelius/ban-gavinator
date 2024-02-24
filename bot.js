require('dotenv').config();
const { Client, GatewayIntentBits, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const { Pool } = require('pg');

// Initialize PostgreSQL pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    port: 5432,
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});


const insultingWords = ['dumb', 'stupid', 'an idiot'];

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomEnemy() {
    const names = ['Ryan', 'Caleb', 'Andrew', 'Gavin', 'Michael', 'Sage', 'Elijah', 'Louie', 'Benjamin'];
    const types = ['Tank', 'Support', 'Normal', 'Damage'];
    const name = names[Math.floor(Math.random() * names.length)];
    const type = types[Math.floor(Math.random() * types.length)];

    return new Enemy(name, type);
}

class Enemy {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.hp = 100;
        this.attack = 10;
        this.defense = 10;
    }
}

class Player {
    constructor(name, playerClass) {
        this.name = name;
        this.playerClass = playerClass;
        this.hp = 100;
        this.attack = 10;
        this.defense = 10;
    }
}

async function register(message) {
    try {
        const alreadyRegistered = await pool.query(
            `SELECT 1 FROM public.player_stats WHERE discord_id = $1`,
            [message.author.id]
        );
        if (alreadyRegistered.rowCount > 0) {
            message.channel.send('You are already registered.');
        } else {
            const startHp = 100;
            await pool.query(
                `INSERT INTO public.player_stats (discord_id, name, health) VALUES ($1, $2, $3)`,
                [message.author.id, message.author.username, startHp]
            );
            message.channel.send('You have been successfully registered.');
        }
    } catch (error) {
        console.error(error);
        message.channel.send('Failed to register your character. Try again later.');
    }
}

// Ryans user ID
const targetUserId = '300683364485038080';

// Bot event listeners
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async (message) => {

    const theMessage = message.content.toLowerCase();
    let enemy = generateRandomEnemy();
    const wonRegex = /\bwon\b/i;
    const betRegex = /\bbet\b/i;

    if (theMessage === '!register') {
        register(message);
    } else if (theMessage === '!pickclass') {
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('selectClass')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Lil Castuh',
                            description: 'A skilled magician',
                            value: 'lil_castuh',
                        },
                        {
                            label: 'Lil Slicuh',
                            description: 'A swift assassin',
                            value: 'lil_slicuh',
                        },
                        {
                            label: 'Big Tankuh',
                            description: 'A sturdy defender',
                            value: 'big_tankuh',
                        },
                    ]),
            );

        await message.reply({ content: 'Choose your class:', components: [row] });
    } else if (theMessage === '!stats') {
        message.channel.send(`name: ${enemy.name} \n type: ${enemy.type} \n hp: ${enemy.hp}`);
    } else if (message.author.id == targetUserId && (theMessage === 'please help' || theMessage === 'wtf')) {
        message.channel.send('Sorry Ryan');
    } else if (wonRegex.test(message.content) || betRegex.test(message.content)) {
        message.channel.send('RYAN PLEASE STOP GAMBLING');
    }
});

client.on('messageCreate', (message) => {
    if (message.mentions.users.some((user) => user.id === targetUserId)) {
        const mentionedUser = message.author;
        const randomInsult = insultingWords[Math.floor(Math.random() * insultingWords.length)];
        message.channel.send(`${mentionedUser} is ${randomInsult}`).catch((err) => {
            console.error("Failed to send message: ", err);
        });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);