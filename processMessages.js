const { getBody, getSender, isSudo } = require("./util/helpers");
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
    if (!isSudo(senderJid)) {
      return;
    }

    switch (command.toLowerCase()) {
      case "greet":
        return await commands.greet(sock, data);
      case "setgreet":
        return await commands.setGreet(sock, data, matches[2]);
      case "tag":
        return await commands.tag(sock, data, matches[2]);
      case "tagall":
        return await commands.tag(sock, data, "all");
      case "getsudo":
        return await commands.getSudo(sock, data);
      case "setsudo":
        return await commands.setAndDelSudo(sock, data, matches[2], "set");
      case "delsudo":
        return await commands.setAndDelSudo(sock, data, matches[2], "del");
      case "img":
        return await commands.img(sock, data, matches[2]);
    }
  });
};
