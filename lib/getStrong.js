const { contextParser, numberFormatter } = require("../util/helpers");

require("dotenv").config();

module.exports.default = async (sock, data) => {
  const text = `*THE STRONG:* ${process.env.STRONG.split(",")
    .map((e) => numberFormatter(e))
    .join(",")}`;
  return await sock.sendMessage(data.key.remoteJid, {
    text,
    contextInfo: contextParser(data),
  });
};
