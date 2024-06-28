const {
  getBody,
  getSender,
  isStrong,
  contextParser,
} = require("./util/helpers");
const commands = require("./lib");
require("dotenv").config();

module.exports.default = async (sock, messages) => {
  if (!messages) {
    return;
  }
  messages.forEach(async (messageInfo) => {
    const messageBody = getBody(messageInfo);

    if (!messageBody) {
      console.log("Not a text message");
      return;
    }

    let message = messageBody.message;
    if (message[0] !== process.env.PREFIX) {
      return;
    }

    message = message.trim().split(" ");
    message = message.filter((element) => element !== "").join(" ");

    const query = message.slice(1).trim();
    const prompt_pattern = /(\w+)(?: ?(.*))?/g;
    const matches = prompt_pattern.exec(query);

    if (!matches) {
      return;
    }

    const command = matches[1];
    const data = {
      text: message,
      key: messageInfo.key,
      message: messageInfo.message,
    };

    const senderJid = getSender(data);
    if (!isStrong(senderJid)) {
      return await sock.sendMessage(data.key.remoteJid, {
        text: "You are weak my friend",
        contextInfo: contextParser(data),
      });
    }

    switch (command.toLowerCase()) {
      case "getstrong":
        return await commands.getStrong(sock, data);
      case "setstrong":
        return await commands.setAndDelStrong(sock, data, matches[2], "set");
      case "delstrong":
        return await commands.setAndDelStrong(sock, data, matches[2], "del");
      case "arise":
        return await commands.arise(sock, data);
    }
  });
};
