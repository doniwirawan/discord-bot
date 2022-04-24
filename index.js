require('dotenv').config()
const Discord = require('discord.js')
const axios = require('axios');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
let interval;


// async function getMeme() {
// const res = await axios.get('https://memeapi.pythonanywhere.com/');
// return res.data.memes[0].url;
// }

async function getNasaPictures() {
    const apiKey = process.env.NASA_API_TOKEN
    const count = 1;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

    try {
        const response = await axios.get(apiUrl)
        // resultsArray = await response.json()
        // console.log(resultsArray.hdurl)
        // return resultsArray.hdurl;
        console.log(response.data[0])
        return response.data[0];

    } catch (error) {
        console.log(error)
    }
}

async function getQuote() {
    const apiUrl = `https://api.quotable.io/random`

    try {
        const res = await axios.get(apiUrl)
        console.log(res.data)
        return res.data
    } catch (err) {
        console.log(err)
    }
}

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}`)
})


client.on('messageCreate', async msg => {
    switch (msg.content) {
        case "ping":
            msg.reply("Pong!");
            break;
        //our meme command below
        // case "!meme":
        //     msg.channel.send("Here's your meme!"); //Replies to user command
        //     const img = await getMeme(); //fetches an URL from the API
        //     msg.channel.send(img); //send the image URL
        //     break;
        case "!nasa":
            msg.channel.send("Here's your nasa picture of the day!"); //Replies to user command
            const nasa_image = await getNasaPictures(); //fetches an URL from the API
            msg.channel.send(`Title: ${nasa_image.title}`);
            msg.channel.send(nasa_image.hdurl); //send the image URL
            msg.channel.send(`Explanation: ${nasa_image.explanation}`)
            break;
        case "!stop":
            msg.channel.send("I have stopped eye reminders.");
            clearInterval(interval);
            break;
        case "!eye":
            msg.channel.send("You are now subscribed to eye reminders.");
            interval = setInterval(function () {
                msg.channel.send("Please take an eye break now!")
                    .catch(console.error);
            }, 3600000); //every hour
            break;
        case "!quote":
            msg.channel.send("Here are your quote of the day.");
            const quote = await getQuote(); // return quote
            msg.channel.send(`"${quote.content}" - ${quote.author}`);

    }
});

client.login(process.env.CLIENT_TOKEN)