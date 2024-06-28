const fs = require("fs");
const { contextParser, getAllJids } = require("../util/helpers");
const getStrong = require("./getStrong").default;
require("dotenv").config();

module.exports.default = async (sock, data, text, option) => {
  const strongStr = process.env.STRONG;
  const strongArr = strongStr.split(",");
  const strongSet = new Set([...strongArr]);
  const toBeModified = getAllJids(data, text);

  if (!toBeModified) {
    return sock.sendMessage(data.key.remoteJid, {
      text: "Must specify the strong",
      contextInfo: contextParser(data),
    });
  }

  if (option === "set") {
    strongSet.add(...toBeModified);
  } else if (option === "del") {
    strongSet.delete(...toBeModified);
  }

  const finalizedArray = Array.from(strongSet);
  const finalizedStr = finalizedArray.join(",");

  process.env.STRONG = finalizedStr;
  const envFile = fs.readFileSync(".env", "utf8");
  const updatedEnvFile = envFile.replace(
    /STRONG=.*/,
    `STRONG="${finalizedStr}"`
  );
  fs.writeFileSync(".env", updatedEnvFile);

  return await getStrong(sock, data);
};
