require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const client = new Client({ checkUpdate: false });

// 프로그램 꺼짐 방지
process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = "1459821173146910854";
const CHANNEL_ID = "1459821173859680432";
const TARGET_BOT_ID = "1047234279802949703";

let loops = { macaron: null, alba: null, dig: null };

async function sendCmd(cmd) {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        const channel = guild?.channels.cache.get(CHANNEL_ID);
        if (!channel) return;
        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log("Sent: /" + cmd);
    } catch (e) {
        console.log("Fail: /" + cmd);
    }
}

function startLoop(name, base, variance, cmd) {
    if (!loops[name]) return;
    sendCmd(cmd);
    const delay = (base + (Math.random() * variance * 2 - variance)) * 1000;
    loops[name] = setTimeout(() => startLoop(name, base, variance, cmd), delay);
}

client.on("messageCreate", async (msg) => {
    if (msg.author.id !== client.user.id || msg.channel.id !== CHANNEL_ID) return;
    const c = msg.content.trim();
    if (c === "!마카롱") { loops.macaron = true; startLoop("macaron", 100, 5, "마카롱"); console.log("Macaron ON"); }
    if (c === "!알바") { loops.alba = true; startLoop("alba", 30, 3, "알바"); console.log("Alba ON"); }
    if (c === "!땅파기") { loops.dig = true; startLoop("dig", 5, 1, "땅파기"); console.log("Dig ON"); }
    if (c === "!중지") {
        Object.keys(loops).forEach(k => { clearTimeout(loops[k]); loops[k] = null; });
        console.log("All Stop");
    }
});

client.once("ready", () => {
    console.log("Logged in: " + client.user.tag);
});

console.log("Connecting...");
client.login(TOKEN).catch(() => console.log("Login Error"));
