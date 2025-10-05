import { listCommands, registerCommand } from "../../commands/registry.js";

registerCommand({
  name: "help",
  description: "List available commands",
  handler: async ({ reply }) => {
    const cmds = listCommands()
      .map((c) => `/${c.name} - ${c.description ?? ""}`)
      .join("\n");
    await reply(`Available commands:\n${cmds}`);
  },
});
