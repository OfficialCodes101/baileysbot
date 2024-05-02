const { contextParser } = require("../util/helpers");

require("dotenv").config();

module.exports.default = async (sock, data) => {
  const sudoArray = JSON.parse(process.env.SUDO);

  return await sock.sendMessage(data.key.remoteJid, {
    text: `*SUDO MEMBERS* \n${sudoArray.join(", ")}`,
    contextInfo: contextParser(data),
  });
};
