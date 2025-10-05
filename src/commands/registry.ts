export type CommandHandler = (payload: {
  args: string[];
  raw: string;
  reply: (text: string) => Promise<unknown> | void;
}) => Promise<unknown> | void;

export interface CommandDefinition {
  name: string;
  description?: string;
  handler: CommandHandler;
}

const commands = new Map<string, CommandDefinition>();

export function registerCommand(cmd: CommandDefinition) {
  if (commands.has(cmd.name)) {
    throw new Error(`Command already registered: ${cmd.name}`);
  }
  commands.set(cmd.name, cmd);
}

export function getCommand(name: string) {
  return commands.get(name);
}

export function listCommands() {
  return Array.from(commands.values());
}

export function clearCommands() {
  commands.clear();
}
