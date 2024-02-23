require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { register } = require('./javascript/Register');
const {generateRandomEnemy, getRandomNumber} = require('./javascript/utils');

// Events.ClientReady is an event that is emitted when the bot is ready, we then pass that as a value readyClient which represents
// the client that is ready. We then log the client's user tag to the console.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
});

let enemy = generateRandomEnemy();
client.on('messageCreate', async (message) => {
    if(message.author.bot) return;

    const theMessage = message.content.toLowerCase();
    async function sendMessage(arg){
        message.channel.send(arg);
    }
    if(theMessage === '!register'){
        register(message);
    }
    if(theMessage === '!pickClass'){
        sendMessage('Choose your class: ');
        sendMessage('1. Lil Castuh\n2. Lil Slicuh\n3. Big Tankuh');
    }

    if(theMessage === '!stats') {
        sendMessage(`name: ${enemy.name} \n type: ${enemy.type} \n hp: ${enemy.hp}`)
    }

    if(message.author === targetUserId && (theMessage === 'please help' || theMessage === 'wtf')) {
        sendMessage('Sorry Ryan');
    }
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

// We login to the bot using the token that is stored in the .env file
client.login(process.env.DISCORD_BOT_TOKEN);
