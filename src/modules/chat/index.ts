import { registerCommand } from "../../commands/registry.js";
import { logger } from "../../logger.js";
import { chat } from "./prompt.js";

registerCommand({
	name: "chat",
	description: "Chat with the AI model",
		handler: async ({ message, args }) => {
		logger.debug("AI module received command with args:", args);
			const userId = message.talker().id || message.talker().name();
			const response = await chat(args.join(" "), userId);
		logger.debug("AI module response:", response);
		if (response === "") {
			await message.say("Error: Unable to get response from AI model.");
			return;
		}
		await message.say(response);
	},
});
