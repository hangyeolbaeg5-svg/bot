require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
// 셀프봇은 intents 설정을 아예 지워야 에러가 안 납니다.
const client = new Client({ checkUpdate: false }); 

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const TARGET_BOT_ID = "1047234279802949703";

let loops = { macaron: null, alba: null, dig: null };

async function sendCmd(cmd) {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        const channel = guild?.channels.cache.get(CHANNEL_ID);
        if (!channel) return;
        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log(`[Sent] /${cmd}`);
    } catch (e) {
        console.error(`[Error] /${cmd}:`, e.message);
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
    if (c === "!마카롱") { loops.macaron = true; startLoop("macaron", 100, 5, "마카롱"); }
    if (c === "!알바") { loops.alba = true; startLoop("alba", 30, 3, "알바"); }
    if (c === "!땅파기") { loops.dig = true; startLoop("dig", 5, 1, "땅파기"); }
    if (c === "!중지") { Object.keys(loops).forEach(k => { clearTimeout(loops[k]); loops[k] = null; }); }
});

client.once("ready", () => console.log(`SUCCESS: ${client.user.tag}`));
client.login(TOKEN);
