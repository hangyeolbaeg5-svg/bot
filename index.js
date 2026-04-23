require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");

// 셀프봇은 인텐트(intents) 설정을 아예 넣지 않아야 에러가 나지 않습니다.
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
        if (!channel) return console.log("채널을 찾을 수 없습니다. ID를 확인하세요.");
        
        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log(`[성공] /${cmd} 실행됨`);
    } catch (e) {
        console.error(`[에러] /${cmd}:`, e.message);
    }
}

function startLoop(name, base, variance, cmd) {
    if (loops[name] === null) return;
    sendCmd(cmd);
    const delay = (base + (Math.random() * variance * 2 - variance)) * 1000;
    loops[name] = setTimeout(() => startLoop(name, base, variance, cmd), delay);
}

client.on("messageCreate", async (msg) => {
    // 내가 지정된 채널에 친 채팅에만 반응합니다.
    if (msg.author.id !== client.user.id || msg.channel.id !== CHANNEL_ID) return;
    
    const c = msg.content.trim();
    if (c === "!마카롱") { loops.macaron = true; startLoop("macaron", 100, 5, "마카롱"); console.log("마카롱 시작"); }
    if (c === "!알바") { loops.alba = true; startLoop("alba", 30, 3, "알바"); console.log("알바 시작"); }
    if (c === "!땅파기") { loops.dig = true; startLoop("dig", 5, 1, "땅파기"); console.log("땅파기 시작"); }
    if (c === "!중지") { 
        Object.keys(loops).forEach(k => { clearTimeout(loops[k]); loops[k] = null; }); 
        console.log("모든 매크로 정지");
    }
});

client.once("ready", () => {
    console.log(`READY: ${client.user.tag} 계정 연결 성공!`);
});

// 로그인
if (TOKEN) {
    client.login(TOKEN).catch(err => console.error("로그인 실패:", err.message));
} else {
    console.error("DISCORD_TOKEN 변수가 설정되지 않았습니다.");
}
