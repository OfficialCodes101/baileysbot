const fs = require("fs");
const { contextParser } = require("../util/helpers");
require("dotenv").config();

module.exports.default = async (sock, data, text) => {
  if (!text) {
    return sock.sendMessage(data.key.remoteJid, {
      text: "Must provide a greet message",
      contextInfo: contextParser(data),
    });
  }
  const greetMessage = process.env.GREET;
  process.env.GREET = text;

  const envFile = fs.readFileSync(".env", "utf8");
  const updatedEnvFile = envFile.replace(
    `GREET="${greetMessage}"`,
    `GREET="${text}"`
  );
  fs.writeFileSync(".env", updatedEnvFile);

  return sock.sendMessage(data.key.remoteJid, {
    text: "Greet message set successfully",
    contextInfo: contextParser(data),
  });
};
