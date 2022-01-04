const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const socketIO = require("socket.io");
const qrcodeTerminal = require("qrcode-terminal");

const client = new Client({
  puppeteer: {
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  clientId: "wacbot",
});
client.initialize();

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
  qrcodeTerminal.generate(qr);
  //   qrcode.toDataURL(qr, (err, url) => {
  //   qrcodeTerminal.generate(url)
  // console.log("URL: ", url);
  //   });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.on("message", async (msg) => {
  if (msg.isStatus) return;

  const chat = msg.getChat();

  if (!(await chat).isGroup) {
    console.log("Chat bukan dari grup");
    if (msg.body === "ping") {
      client.sendMessage("pong");
    }
  }
  console.log("MESSAGE RECEIVED", msg);
});
