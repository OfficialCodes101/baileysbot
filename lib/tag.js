const { contextParser, numberFormatter } = require("../util/helpers");

module.exports.default = async (sock, data, options) => {
  if (!options) {
    await sock.sendMessage(data.key.remoteJid, {
      text: "Can't tag them for no reason now can I",
      contextInfo: contextParser(data),
    });
    return;
  }
  const metadata = await sock.groupMetadata(data.key.remoteJid);
  const participantsIDs = metadata.participants.map((participant) => {
    return participant.id;
  });

  if (options === "all") {
    const participants = participantsIDs.map((participant) => {
      let personIDRemade = numberFormatter(participant);
      return "@" + personIDRemade;
    });
    let message = participants.join("\n");
    let contextInfo = data.message?.extendedTextMessage?.contextInfo;
    if (!contextInfo) {
      contextInfo = contextParser(data);
    }
    await sock.sendMessage(data.key.remoteJid, {
      text: message,
      mentions: participantsIDs,
      contextInfo,
    });
  } else {
    const context = contextParser(data);
    context.mentionedJid = participantsIDs;
    await sock.sendMessage(data.key.remoteJid, {
      text: options,
      contextInfo: context,
    });
  }
};
