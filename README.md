# dsc.stats
A very simple library to store user statistics on discord.js

`npm i dsc.stats`

> **DISCLAIMER** *It's currently under construction, so there will not be many features*

*MongoPass and MongoUser are needed because MongoDB might have problems to connect.*
```js
  const bot = new Client(); // YOUR DISCORD CLIENT *EXAMPLE*
  const { UserStats } = require('dsc.stats');
  const stats = new UserStats({
    mongoURL: 'MONGO_URL', 
    mongoPass: 'MONGO_PASS',
    mongoUser: 'MONGO_USER',
  });

  bot.on('messageCreate', (message) => {

    stats.update(message.author.id, 'messages', 1);

  });

```