const User = require("../model/user.js");
const Profile = require("../model/profiles.js");
const profileManager = require("./profile.js");
const Friends = require("../model/friends.js");
const uuid = require("uuid");

function MakeID() {
    return uuid.v4();
}

async function registerUser(targetId, username, email, password) {
    email = email.toLowerCase();

    const accountId = MakeID().replace(/-/ig, "");
    const matchmakingId = MakeID().replace(/-/ig, "");

    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailFilter.test(email)) return { message: "You did not provide a valid email address!", status: 400 };

    if (username.length >= 25) return { message: "Your username must be less than 25 characters long.", status: 400 };
    if (username.length < 3) return { message: "Your username must be atleast 3 characters long.", status: 400 };

    const allowedCharacters = (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~").split("");
    for (let character of username) {
        if (!allowedCharacters.includes(character)) return { message: "Your username has special characters.", status: 400 };
    }

    try {
        const newUser = await User.create({ 
            created: new Date().toISOString(), 
            discordId: targetId, 
            accountId, 
            matchmakingId,
            username, 
            username_lower: username.toLowerCase(), 
            email, 
            password: password 
        });

        await Profile.create({ 
            created: newUser.created, 
            accountId: newUser.accountId, 
            profiles: profileManager.createProfiles(newUser.accountId) 
        });

        await Friends.create({ 
            created: newUser.created, 
            accountId: newUser.accountId 
        });

    } catch (err) {
        if (err.code == 11000) return { message: `Username or email is already in use.`, status: 400 };
        return { message: err.message || "An unknown error has occured.", status: 400 };
    };

    return { message: `Successfully created account`, status: 200 };
}

module.exports = {
    MakeID,
    registerUser
}