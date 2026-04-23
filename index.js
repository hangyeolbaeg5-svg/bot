require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
// 셀프봇은 Client 안에 아무것도 넣지 않는 것이 가장 깔끔합니다.
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
        if (!channel) return console.log("채널을 찾지 못함 (ID 확인 필요)");
        
        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log(`[작동] /${cmd}`);
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
    // 본인 계정 메시지이고 지정된 채널일 때만 작동
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
    console.log(`READY: ${client.user.tag} 계정으로 로그인 성공!`);
});

// 로그인 실행
if (TOKEN) {
    client.login(TOKEN).catch(err => console.error("로그인 실패:", err.message));
} else {
    console.error("DISCORD_TOKEN 변수가 없습니다!");
}
