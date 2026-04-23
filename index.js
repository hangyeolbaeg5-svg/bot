require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const client = new Client({ checkUpdate: false });

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID || "1459821173146910854";
const CHANNEL_ID = process.env.CHANNEL_ID || "1459821173859680432";
const TARGET_BOT_ID = "1047234279802949703";

let loops = { macaron: null, alba: null, dig: null };

function randomDelay(base, variance) {
    return (base + (Math.random() * variance * 2 - variance)) * 1000;
}

async function sendCmd(cmd) {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        const channel = guild.channels.cache.get(CHANNEL_ID);
        if (!channel) return console.error("Channel not found");

        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log(`[Sent] /${cmd}`);
    } catch (e) {
        console.error(`[Error] /${cmd}:`, e.message);
    }
}

async function startLoop(name, base, variance, cmd) {
    if (!loops[name]) return;
    await sendCmd(cmd);
    loops[name] = setTimeout(() => startLoop(name, base, variance, cmd), randomDelay(base, variance));
}

function toggle(name, base, variance, cmd) {
    if (loops[name]) {
        clearTimeout(loops[name]);
        loops[name] = null;
        console.log(`[OFF] ${cmd}`);
    } else {
        console.log(`[ON] ${cmd}`);
        loops[name] = true; 
        startLoop(name, base, variance, cmd);
    }
}

client.on("messageCreate", async (msg) => {
    if (msg.author.id !== client.user.id || msg.channel.id !== CHANNEL_ID) return;
    const c = msg.content.trim();
    if (c === "!마카롱") toggle("macaron", 100, 5, "마카롱");
    if (c === "!알바") toggle("alba", 30, 3, "알바");
    if (c === "!땅파기") toggle("dig", 5, 1, "땅파기");
    if (c === "!중지") {
        Object.keys(loops).forEach(k => { 
            if(loops[k]) clearTimeout(loops[k]); 
            loops[k] = null; 
        });
        console.log("[STOP ALL]");
    }
});

client.once("ready", () => console.log(`Logged in as: ${client.user.tag}`));
client.login(TOKEN);
