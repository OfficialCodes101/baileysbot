const {
  makeWASocket,
  DisconnectReason,
  BufferJSON,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const processMessages = require("./processMessages").default;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({
    // can provide additional config here
    auth: state,
    printQRInTerminal: true,
  });
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });
  sock.ev.on("messages.upsert", async (m) => {
    console.log(JSON.stringify(m.messages, undefined, 2));
    try {
      if (m.type === "notify") {
        await processMessages(sock, m.messages);
      }
    } catch (err) {
      await sock.sendMessage(m.messages[0].key.remoteJid, {
        text: "An error occured",
      });
    }
  });
  sock.ev.on("creds.update", saveCreds);
}
// run in main file
connectToWhatsApp();
