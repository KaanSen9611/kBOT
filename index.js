const startTime = Date.now();
const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/kbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/kbot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/kbot-ping - check bot latency
/kbot-catfact - a fact abt cats!
/kbot-joke - be ready to laugh!
/kbot-help - confused? type this in!
/kbot-uptime - how long i survived
/kbot-userinfo - who are you again?
/kbot-avatar - ur face, but digital`
  });
});

app.command("/kbot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/kbot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});


app.command("/kbot-uptime", async ({ ack, respond }) => {
  await ack();

  const uptimeMs = Date.now() - startTime;
  const uptimeMinutes = Math.floor(uptimeMs / 60000);
  const uptimeHours = Math.floor(uptimeMinutes / 60);

  await respond(
    `kBOT has been online for ${uptimeHours} hours and ${uptimeMinutes % 60} minutes.`
  );
});

app.command("/kbot-userinfo", async ({ command, ack, client, respond }) => {
  await ack();

  const user = await client.users.info({
    user: command.user_id
  });

  await respond(
    `Name: ${user.user.real_name}
User ID: ${user.user.id}
Username: @${user.user.name}`
  );
});

app.command("/kbot-avatar", async ({ command, ack, client, respond }) => {
  await ack();

  const user = await client.users.info({
    user: command.user_id
  });

  await respond(
    `Your profile picture:\n${user.user.profile.image_512}`
  );
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
