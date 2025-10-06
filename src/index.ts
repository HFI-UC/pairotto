import qrcodeTerminal from "qrcode-terminal";
import { WechatyBuilder, type Message } from "wechaty";
import { COMMAND_PREFIX } from "./config.js";
import { logger } from "./logger.js";
import { loadModules } from "./modules/index.js";
import { getCommand } from "./commands/registry.js";
import { setLastImage } from "./modules/chat/imageStore.js";

// // Backup Options
import { WechatferryPuppet } from '@wechatferry/puppet'
const puppet = new WechatferryPuppet()
const wechaty = WechatyBuilder.build({ puppet });
wechaty.on("scan", (qrcode, status) => {
  qrcodeTerminal.generate(qrcode, { small: true });
  logger.info(
    `Scan QR Code to login: https://wechaty.js.org/qrcode/${encodeURIComponent(
      qrcode
    )}`
  );
  logger.debug(`Scan status: ${status}`);
});

wechaty.on("login", (user) => logger.success(`User ${user} logged in`));
wechaty.on("message", async (message: Message) => {
  try {
    logger.debug(`Message: ${message}`);
    const text = message.text();
  if (message.type() === (wechaty as any).Message.Type.Image) {
      try {
        const fileBox = await message.toFileBox();
        const buffer = await fileBox.toBuffer();
        const MAX_BYTES = 5 * 1024 * 1024;
        if (buffer.byteLength > MAX_BYTES) {
          return
        } else {
          const base64 = buffer.toString("base64");
            setLastImage(message.talker().id || message.talker().name(), {
              base64,
              mimeType: fileBox.mediaType || "image/jpeg",
              fileName: fileBox.name,
            });
        }
      } catch (e) {
        logger.error("Failed to process image message", e);
      }
      return;
    }
    if (!text.startsWith(COMMAND_PREFIX) || message.self()) return;

    const raw = text.slice(COMMAND_PREFIX.length).trim();
    const [nameRaw, ...args] = raw.split(/\s+/);
    const name = nameRaw?.trim();
    if (!name) {
      await message.say("Empty command");
      return;
    }

    const cmd = getCommand(name);
    if (!cmd) {
      await message.say(
        `Unknown command: ${name}. Use ${COMMAND_PREFIX}help to list commands.`
      );
      return;
    }

    await cmd.handler({
      args,
      raw,
      message,
    });
  } catch (err) {
    logger.error("Error handling message:", err);
  }
});

await loadModules();
wechaty.start();
