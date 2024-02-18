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
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.hp = 100;
        this.attack = 10;
        this.defense = 10;
    }
}

function generateRandomEnemy() {
      const names = ['Ryan', 'Caleb', 'Andrew', 'Gavin', 'Micheal', 'Sage', 'Elijah', 'Louie', 'Benjamin'];
      const types = ['Tank', 'Support', 'Normal', 'Damage'];
      const name = names[Math.floor(Math.random() * names.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      return new Enemy(name, type);
}

const enemy = generateRandomEnemy();
client.on('messageCreate', (message) => {
    const theMessage = message.content.toLowerCase();
    function sendMessage(arg) {
        message.channel.send(arg);
    }
    if(theMessage === 'ryan') {
        if(enemy.hp > 0) {
            const dmg = getRandomNumber(1, 20);
            if(dmg > 14) sendMessage('CRITICAL HIT');
            enemy.hp -= dmg;
            sendMessage(`Attacking ${enemy.name} for ${dmg}hp \n ${enemy.name} now has ${enemy.hp}hp`);
        } else {
            sendMessage(`${enemy.name} has been defeated! Type *continue* to move on to the next boss!`);
        }
    }

    // Separate check for "continue" to ensure it's not nested within another condition
    if(theMessage === 'continue' && enemy.hp <= 0) {
        enemy.hp = 100; // Reset enemy HP
        sendMessage(`A wild ${enemy.name} blocks your path!`);
    } else if (theMessage === 'continue' && enemy.hp > 0) {
        sendMessage("You cannot continue yet, the enemy is still standing!");
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
