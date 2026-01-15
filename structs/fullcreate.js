const readline = require("readline");
const connectDB = require("./database.js");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { Client, GatewayIntentBits } = require("discord.js");
const { AutoComplete } = require("enquirer");
const functions = require("./process.js");

const config = require(path.join(__dirname, "../config/Config.json"));

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = q => new Promise(res => rl.question(q, res));

async function getDiscordUser() {
    const mode = await ask("Search Discord members or enter ID manually? (search/manual): ");

    if (mode.toLowerCase() === "manual") {
        return await ask("Enter Discord ID: ");
    }

    console.log("Connecting to Discord...");
    try {
        await client.login(config.botToken);
        const guild = await client.guilds.fetch(config.guildId);
        const members = await guild.members.fetch();
        
        const choices = members.map(m => ({
            name: `${m.user.username} (${m.displayName})`,
            value: m.id
        }));

        const prompt = new AutoComplete({
            name: 'user',
            message: 'Search for a user (Type to filter):',
            limit: 10,
            choices: choices
        });

        const selectedName = await prompt.run();
        const selectedUser = choices.find(c => c.name === selectedName);
        return selectedUser.value;
    } catch (err) {
        console.log("Failed to fetch Discord members. Switching to manual mode.");
        return await ask("Enter Discord ID: ");
    }
}

(async () => {
    try {
        await connectDB();

        console.log("=== Account Creator ===");

        let targetId = "0";
        if (config.useDiscord) {
            targetId = await getDiscordUser();
            console.log(`ID Set to: ${targetId}`);
        }

        const email = await ask("Email: ");
        const username = await ask("Username: ");
        const password = await ask("Password: ");

        console.log("\n Creating account...\n");

        const resp = await functions.registerUser(targetId, username, email, password);

        if (resp.status < 400) {
            console.log("Success");
        } else {
            console.log("Failed:", resp.message);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        rl.close();
        await mongoose.disconnect();
        if (client.token) client.destroy();
        process.exit();
    }

})();
