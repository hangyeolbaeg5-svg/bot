require("dotenv").config(); // .env 파일을 읽어오기 위한 설정
const { Client } = require("discord.js-selfbot-v13");

// [핵심] TypeError 방지 및 업데이트 체크 비활성화
const client = new Client({ 
    checkUpdate: false,
    patchVoice: true 
});

// 에러 발생 시 프로세스가 죽지 않도록 방어
process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

// 환경 변수에서 값 불러오기
const TOKEN = process.env.DISCORD_TOKEN; 
const GUILD_ID = "1459821173146910854";
const CHANNEL_ID = "1459821173859680432";
const TARGET_BOT_ID = "1047234279802949703";

let loops = { macaron: null, alba: null, dig: null };

function randomDelay(base, variance) {
    return (base + (Math.random() * variance * 2 - variance)) * 1000;
}

async function sendCmd(cmd) {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        const channel = guild?.channels.cache.get(CHANNEL_ID);
        if (!channel) return console.log("Channel not found");

        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log("Success: /" + cmd);
    } catch (e) {
        console.error("Fail: /" + cmd, e.message);
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
        console.log(cmd + " OFF");
    } else {
        console.log(cmd + " ON");
        loops[name] = true; // 루프 상태 활성화
        startLoop(name, base, variance, cmd);
    }
}

client.on("messageCreate", async (msg) => {
    // 본인이 보낸 메시지이며 설정된 채널일 때만 반응
    if (msg.author.id !== client.user.id || msg.channel.id !== CHANNEL_ID) return;
    
    const c = msg.content.trim();
    if (c === "!마카롱") toggle("macaron", 100, 5, "마카롱");
    if (c === "!알바") toggle("alba", 30, 3, "알바");
    if (c === "!땅파기") toggle("dig", 5, 1, "땅파기");
    if (c === "!중지") {
        Object.keys(loops).forEach(k => { 
            clearTimeout(loops[k]); 
            loops[k] = null; 
        });
        console.log("STOP ALL");
    }
});

client.once("ready", () => console.log("Logged in as: " + client.user.tag));

// 로그인 시도
console.log("Connecting...");
client.login(TOKEN).catch(err => console.error("Login Error: " + err.message));
