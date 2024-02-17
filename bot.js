require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

const insultingWords = [
    'dumb',
    'stupid',
    'an idiot'
];
// Ryans user id
const targetUserId = '300683364485038080';

// Events.ClientReady is an event that is emitted when the bot is ready, we then pass that as a value readyClient which represents
// the client that is ready. We then log the client's user tag to the console.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Enemy {
    constructor() {
        this.hp = 100;
        this.name = 'Ryan'
        this.attack = 10;
    }

}

const enemy = new Enemy();
client.on('messageCreate', (message) => {
    if(message.content === 'ryan' || message.content === 'Ryan') {
        if(enemy.hp > 0) {
            const dmg = getRandomNumber(1, 20);
            if(dmg > 14){
                message.channel.send('CRITICAL HIT')
            }
            enemy.hp = enemy.hp - dmg;
            message.channel.send(`Attacking ${enemy.name} for ${dmg}hp \n Ryan now has ${enemy.hp}hp`);
        } else {
            message.channel.send(`${enemy.name} has been defeated! Type *continue* to move on to the next boss!`);
        }

        if(message.content === 'continue' && enemy.hp >= 0) {
            message.channel.send(`A wild ${enemy.name} blocks your path!`);
            enemy.hp = 100;
        }
    }
    
})


// Events.MessageCreate is an event that is emitted when a message is created, we then pass that as a value message which represents
// the message that was created. We then check if the message mentions the target user, if it does we then send a message to the channel
client.on('messageCreate', (message) => {
    if (message.mentions.users.some((user) => user.id === targetUserId)) {
        const mentionedUser = message.author;
        const randomInsult = insultingWords[Math.floor(Math.random() * insultingWords.length)];
        message.channel.send(`${mentionedUser} is ${randomInsult}`).catch(err => {
            console.error("Failed to send message: ", err);
        });
    }
});

// if client sends banan, send banana ascii art
client.on('messageCreate', (message) => {
    if (message.content === 'banan') {
        message.channel.send('```\n' +
            '     _\n' +
            '   //\\\n' +
            '  V  \\\n' +
            '   \\  \\_\n' +
            "    \\,'.`-.\n" +
            '     |\\ `. `.\n' +
            '     ( \\  `. `-.                        _,.-:\\\n' +
            '      \\ \\   `.  `-._             __..--\' ,-\'\';/\n' +
            '       \\ `.   `-.   `-..___..---\'   _.--\' ,\'/\n' +
            '        `. `.    `-._        __..--\'    ,\' /\n' +
            '          `. `-_     ``--..\'\'       _.-\' ,\'\n' +
            '            `-_ `-.___        __,--\'   ,\'\n' +
            '               `-.__  `----"""    __.-\'\n' +
            '                  `--..____..--\'\n' +
            '```');
    }
});


// We login to the bot using the token that is stored in the .env file
client.login(process.env.DISCORD_BOT_TOKEN);
