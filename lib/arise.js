const { contextParser, numberFormatter } = require("../util/helpers");

require("dotenv").config();

module.exports.default = async (sock, data) => {
  if (!data.key.remoteJid.endsWith("@g.us")) {
    return await sock.sendMessage(data.key.remoteJid, {
      text: "_Can only use in a group_",
      contextInfo: contextParser(data),
    });
  }
  const strongStr = process.env.STRONG;
  const strongArr = strongStr.split(",");

  const strongJIDSInGroup = [];
  const strongNumbersInGroup = [];

  const metadata = await sock.groupMetadata(data.key.remoteJid);
  metadata.participants.forEach((e) => {
    if (strongArr.includes(e.id)) {
      strongJIDSInGroup.push(e.id);
      strongNumbersInGroup.push(`@${numberFormatter(e.id)}`);
    }
  });

  if (strongJIDSInGroup.length < 1 || strongNumbersInGroup.length < 1) {
    return await sock.sendMessage(data.key.remoteJid, {
      text: "No strong here, only weaklings",
    });
  }
  const declaration = strongNumbersInGroup.join("\n");
  return await sock.sendMessage(data.key.remoteJid, {
    text: declaration,
    mentions: strongJIDSInGroup,
  });
};
