const fs = require("fs");
const { contextParser, getAllJids } = require("../util/helpers");
require("dotenv").config();
const getSudo = require("./getSudo").default;

module.exports.default = async (sock, data, text, option) => {
  const sudoStr = process.env.SUDO;
  const sudoArray = new Set(JSON.parse(sudoStr));
  const toBeModified = getAllJids(data, text);

  if (!toBeModified) {
    return sock.sendMessage(data.key.remoteJid, {
      text: "Must specify one or more arguments",
      contextInfo: contextParser(data),
    });
  }

  if (option === "set") {
    sudoArray.add(...toBeModified);
  } else if (option === "del") {
    sudoArray.delete(...toBeModified);
  }

  const finalizedArray = JSON.stringify([...sudoArray]);

  process.env.SUDO = finalizedArray;
  const envFile = fs.readFileSync(".env", "utf8");
  const updatedEnvFile = envFile.replace(
    `SUDO=${sudoStr}`,
    `SUDO=${finalizedArray}`
  );
  fs.writeFileSync(".env", updatedEnvFile);

  return await getSudo(sock, data);
};
