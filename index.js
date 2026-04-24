require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");

const client = new Client({ checkUpdate: false });

const TOKEN = process.env.DISCORD_TOKEN;

// ⚠️ 무조건 문자열
const GUILD_ID = "1459821173146910854";
const CHANNEL_ID = "1459821173859680432";
const TARGET_BOT_ID = "1047234279802949703";

let loops = {
    macaron: null,
    alba: null,
    dig: null
};

// 랜덤 딜레이
function randomDelay(base, variance) {
    return (base + (Math.random() * variance * 2 - variance)) * 1000;
}

// 슬래시 명령 보내기
async function sendCmd(cmd) {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);

        if (!channel) {
            console.log("❌ 채널 못찾음");
            return;
        }

        await channel.sendSlash(TARGET_BOT_ID, cmd);
        console.log(`✅ ${cmd} 실행`);
    } catch (e) {
        console.error(`❌ ${cmd} 실패:`, e.message);
    }
}

// 반복 루프
async function startLoop(name, base, variance, cmd) {
    await sendCmd(cmd);

    loops[name] = setTimeout(() => {
        startLoop(name, base, variance, cmd);
    }, randomDelay(base, variance));
}

// ON/OFF 토글
function toggle(name, base, variance, cmd) {
    if (loops[name]) {
        clearTimeout(loops[name]);
        loops[name] = null;
        console.log(`🔴 ${cmd} OFF`);
    } else {
        console.log(`🟢 ${cmd} ON`);
        startLoop(name, base, variance, cmd);
    }
}

// 명령어 감지
client.on("messageCreate", async (msg) => {
    // 본인 메시지만 처리
    if (msg.author.id !== client.user.id) return;
    if (msg.channel.id !== CHANNEL_ID) return;

    const c = msg.content.trim();

    if (c === "!마카롱") toggle("macaron", 100, 5, "마카롱");
    if (c === "!알바") toggle("alba", 30, 3, "알바");
    if (c === "!땅파기") toggle("dig", 5, 1, "땅파기");

    if (c === "!중지") {
        Object.keys(loops).forEach(k => {
            clearTimeout(loops[k]);
            loops[k] = null;
        });
        console.log("⛔ 전체 정지");
    }
});

// 로그인 완료
client.once("ready", () => {
    console.log(`✅ 로그인됨: ${client.user.tag}`);
});

client.login(TOKEN);
