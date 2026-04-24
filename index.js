require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const client = new Client({ checkUpdate: false });

// ⚠️ 에러 발생 시 프로세스가 꺼지는 것을 방지
process.on('unhandledRejection', (reason, promise) => {});
process.on('uncaughtException', (err, origin) => {});

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = "1459821173146910854";
const CHANNEL_ID = "1459821173859680432";
const TARGET_BOT_ID = "1047234279802949703";

let loops = { macaron: null, alba: null, dig: null };

async function sendCmd(cmd) {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        const channel = guild?.channels.cache.get(CHANNEL_ID);
        if (!channel) return console.log("채널 찾기 실패");
        
        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log("명령어 전송 성공: /" + cmd);
    } catch (e) {
        console.error("명령어 전송 실패: " + e.message);
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
    if (c === "!마카롱") { loops.macaron = true; startLoop("macaron", 100, 5, "마카롱"); console.log("마카롱 시작"); }
    if (c === "!알바") { loops.alba = true; startLoop("alba", 30, 3, "알바"); console.log("알바 시작"); }
    if (c === "!땅파기") { loops.dig = true; startLoop("dig", 5, 1, "땅파기"); console.log("땅파기 시작"); }
    if (c === "!중지") {
        Object.keys(loops).forEach(k => { clearTimeout(loops[k]); loops[k] = null; });
        console.log("모든 매크로 중지");
    }
});

client.once("ready", () => {
    console.log("===============================");
    console.log("로그인 성공: " + client.user.tag);
    console.log("봇이 준비되었습니다!");
    console.log("===============================");
});

console.log("디스코드 연결 시도 중...");
client.login(TOKEN).catch(err => {
    console.error("로그인 실패: " + err.message);
});
