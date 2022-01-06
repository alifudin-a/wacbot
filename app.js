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
  console.log("QR RECEIVED");
  qrcodeTerminal.generate(qr, { small: true });
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
  // filter pesan masuk agar tidak membalas pesan dari status
  if (msg.isStatus) return;

  // ubah semua keyword ke lowercase
  const keyword = msg.body.toLowerCase();
  console.log(keyword);

  // ambil tipe / detail chat
  const chat = msg.getChat();

  // filter pesan masuk agar tidak membalas pesan dari grup
  if (!(await chat).isGroup) {
    console.log("Chat bukan dari grup");
    if (keyword === "ping") {
      client.sendMessage(msg.from, "pong");
    } else if (keyword === "form") {
      client.sendMessage(
        msg.from,
        "Hi! Terimakasih sudah chat Helpdesk IT, tim Helpdesk IT akan bantu secepatnya yah."
      );
      client.sendMessage(
        msg.from,
        "Mohon berikan penjelasan mendetail terkait kendala kamu dan berikan data pendukungnya."
      );
      client.sendMessage(
        msg.from,
        "**[Form]* \n**Nama* : \n**NPM* : \n**Prodi* : \n**Kendala* :"
      );
    } else if (keyword.match(/\[[^\]]*]/g)) {
      client.sendMessage(msg.from, "Terima kasih!");
    }
  }
  // console.log("MESSAGE RECEIVED", msg);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});
