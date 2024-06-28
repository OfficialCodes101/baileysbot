require("dotenv").config();

module.exports.contextParser = (data) => {
  const sender = data.key.participant
    ? data.key.participant
    : data.key.remoteJid;
  return {
    stanzaId: data.key.id,
    participant: sender,
    quotedMessage: {
      conversation: data.text,
    },
  };
};

module.exports.getBody = (msg) => {
  let message;
  message = msg?.message?.extendedTextMessage?.text;
  if (message) {
    return { message, type: "text" };
  }
  message = msg?.message?.conversation;
  if (message) {
    return { message, type: "text" };
  }
  message = msg?.message?.imageMessage?.caption;
  if (message) {
    return { message, type: "image" };
  }
  message = msg?.message?.videoMessage?.caption;
  if (message) {
    return { message, type: "video" };
  }
};

module.exports.getSender = (data) => {
  let userJid;
  userJid = data.key?.participant;
  if (userJid) {
    return userJid;
  }
  userJid = data.key?.remoteJid;
  if (userJid) {
    return userJid;
  }
};

module.exports.numberFormatter = (number) => {
  const pattern = /(\d+)(?::\d+)?/;
  const matches = pattern.exec(number);

  return matches[1];
};

module.exports.isAdmin = async (sock, remoteJid, jid) => {
  const properJid = this.numberFormatter(jid) + "@s.whatsapp.net";
  const groupMetadata = await sock.groupMetadata(remoteJid);
  const participants = groupMetadata.participants;
  const interestedIn = participants.filter((item) => {
    return item.id === properJid;
  });
  return !!interestedIn[0].admin;
};

module.exports.getMentions = (data) => {
  const mentions = data.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (!mentions) {
    return new Set();
  }
  return new Set(mentions);
};

module.exports.isStrong = (senderJid) => {
  const strongArr = process.env.STRONG.split(",");
  return strongArr.includes(senderJid);
};

module.exports.getAllJids = (data, text) => {
  const allJids = this.getMentions(data);

  if (text) {
    text.split(" ").forEach((item) => {
      const number = this.numberFormatter(item);
      if (!number) {
        return;
      }
      allJids.add(`${number}@s.whatsapp.net`);
    });
  }

  const possibleReplied =
    data.message?.extendedTextMessage?.contextInfo?.participant;
  if (possibleReplied) {
    allJids.add(possibleReplied);
  }
  return allJids;
};
