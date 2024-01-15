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

const targetUserId = '300683364485038080';

// Events.ClientReady is an event that is emitted when the bot is ready, we then pass that as a value readyClient which represents
// the client that is ready. We then log the client's user tag to the console.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
});

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
    } else {
        console.log(message);
    }
});


// We login to the bot using the token that is stored in the .env file
client.login(process.env.DISCORD_BOT_TOKEN);
