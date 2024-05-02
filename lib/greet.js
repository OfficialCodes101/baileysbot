const { getMentions } = require("../util/helpers");

module.exports.default = async (sock, data) => {
  const mentions = getMentions(data);
  console.log(mentions);

  await sock.sendMessage(data.key.remoteJid, {
    text: process.env.GREET,
    mentions: mentions,
  });
};
