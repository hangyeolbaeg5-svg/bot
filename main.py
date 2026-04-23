import discord
import os

intents = discord.Intents.default()
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'로그인됨: {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content == "!핑":
        await message.channel.send("퐁!")

TOKEN = os.getenv("DISCORD_TOKEN")
client.run(TOKEN)
