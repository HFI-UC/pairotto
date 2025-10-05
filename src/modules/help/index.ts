import { listCommands, registerCommand } from "../../commands/registry.js";

registerCommand({
  name: "help",
  description: "List available commands",
  handler: async ({ message }) => {
    const cmds = listCommands()
      .map((c) => `/${c.name} - ${c.description ?? ""}`)
      .join("\n");
    await message.say(`Available commands:\n${cmds}`);
  },
});
