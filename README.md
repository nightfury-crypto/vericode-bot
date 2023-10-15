# VeriCode Bot


```
🔥 Well I am not a bot, I am a human with some superpowers. 🔥
```

![vericodebot](https://github.com/nightfury-crypto/vericode-bot/blob/main/assets/display-readme/botprofile.png?raw=true)

`
A Discord bot designed for automating the process of challenges or events within the Discord server. This bot can handle users streaks, create/update/delete an event, verify user post and also export the user entries of an event in a csv file along with tokens distribution. 
`

<button style="padding: 5px 15px; color: #ffff; background: rgba(29, 29,29)"><a href="https://discord.com/api/oauth2/authorize?client_id=1157932141427048521&permissions=8&scope=bot%20applications.commands" style="color: inherit; text-decoration: none">ADD TO SERVER</a></button>

### NEED ?

Manually track the event or event posts of so many participants is a time taking and is prone to error. A bot can do this thing within few seconds to a minute. This manual tracking, verification and token distribution is not an easy task for a human. That's why `VeriCode bot` is here to help you out in this process and speed up this verification and token distribution.

## VeriCode Bot Features/Commands.

**Slash Commands -** 

`/help` - This command will DM the user about the bot commands with their usage.

![help](https://github.com/nightfury-crypto/vericode-bot/blob/main/assets/display-readme/helpdm.png?raw=true)

```
Admin or Moderator
```

**- [ I ]**  `/eventadd` - This will take 2 arguments **--channelId** and **--isSocialLink**.

This command is used to create a new event. The event ID is equal to the channel ID. and isSocial is just a boolean option true/false.(whether twitter/linkedin post link is required or not.). Remember isSocial once set cannot be changed. After that a modal will open to fill the event details.

**- [ II ]**  `/eventupdate` - This will take 1 argument **--channelId**

This command is used to update the event. The event ID is equal to the channel ID. After that a modal will open to update the event details

---
create and update both having modal functionality

![create](https://github.com/nightfury-crypto/vericode-bot/blob/main/assets/display-readme/create.png?raw=true) 

---

**- [ III ]**  `/eventdelete` - This will take 1 argument **--channelId**

This command is used to delete the event. The event ID is equal to the channel ID.

**- [ IV ]**  `/export` - This will take 1 argument **--channelId**

This command is used to export the event entries of users in a csv file. This csv file will contain ["user_id", "username", "streaks", "eligibile status"] details. Which can be used for the automation of token distribution. The event ID is equal to the channel ID.

**- [ V ]**  `/addtoken` - This will take 2 argument **--channelId** and **--attachment_csvfile**

This command is used to add tokens to the users from the csv file according to their eligibility criteria. This csv file will contain ["user_id", "username", "streaks", "eligibile status"] details. After the process it will give information about the successfull and failed token distribution in 2 separate files. The event ID is equal to the channel ID.

```
participants (@everyone)
```
**- [ I ]**  `/entry` - This will take 2 argument **--content** and **--attachments** *(optional)*

This command is used to post the content to maintain their streaks according to the format provided.
*(Note: use this command inside the event channel only. It is channel specific and event specific only.)*


`These are just few features of this bot: more will come.`

### 🛠️ Installation & Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/nightfury-crypto/vericode-bot.git
   cd vericode-bot
2. **Create .env file in root directory**

    ```
    DISCORD_TOKEN = <discord token>
    CLIENT_ID = <client id>
    CLIENT_SECRET = <client secret>

    TATSU_API_KEY = <tatsu api>
    APIFY_API_KEY = <apify api>
    ``` 
3. **Create `firebase-setup.js` file inside `./constants/firebase-setup`**

    ```
    const admin = require("firebase-admin")

    const serviceAccount = require("<firebase-adminsdk.json />");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore()

    module.exports = db;
    ``` 

4. run the command
    ```
    npm install
    npm run dev
    ```
    