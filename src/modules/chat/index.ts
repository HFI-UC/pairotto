import { registerCommand } from "../../commands/registry.js";
import { logger } from "../../logger.js";
import { chat } from "./prompt.js";

registerCommand({
	name: "chat",
	description: "Chat with the AI model",
	handler: async ({ reply, args }) => {
		logger.debug("AI module received command with args:", args);
		const response = await chat(args.join(" "));
		logger.debug("AI module response:", response);
		if (response === "") {
			await reply("Error: Unable to get response from AI model.");
			return;
		}
		await reply(response);
	},
});
