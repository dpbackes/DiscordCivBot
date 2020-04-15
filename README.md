# Discord Civ Bot
Discord Civ Bot is a simple chat bot that can be used to keep track of whose turn it is during a cloud game Civilization 6

## Commands
### `set order for <game name> to <comma separated list of users>`
- Sets the order for the specified game name to the list of users. The list of users should be a comma separated list of @mentions. The first player in the list will be set to the current player.
- _Example_: `set order for first game to @playerone, @playertwo, @playerthree`
### `get order for <game name>`
- Gets the order for the specified game
### `set current player for <game name> to @playername`
- Sets the current player for the given game to @playername. Be sure to use the proper @mention
- _Exmaple_: `set current player for first game to @playertwo`
### `get current player for <game name>`
- Gets the current player for the specified game
### `I'm done in <game name>`
 - Indicate that you have finished your turn in the specified game
 - _Example_: `I'm done in first game`

 ## Usage
 This is a pretty straight forward node app. Follow the instructions below to get it up and running

 ```
 git clone <url to this repo>
 cd DiscordCivBot
 cp .env.example .env
 ```

 Update the `.env` file to include your Discord api key. Once you've done that, you're ready to run the app:

 ```
 node index.js
 ```

 If you use Vscode, there's a `launch.json` in place for you to use to help debugging.