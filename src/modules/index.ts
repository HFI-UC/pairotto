import { promises } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadModules() {
    const modulesDir = __dirname;
    let entries;
    logger.info("Loading modules...");
    try {
        entries = await promises.readdir(modulesDir, { withFileTypes: true });
        logger.debug(`Reading modules from directory: ${modulesDir}`);
    } catch (err) {
        logger.warn(`Modules directory not found: ${modulesDir}`);
        return;
    }
    for (const dirent of entries) {
        if (!dirent.isDirectory()) continue;
        const spec = `./${dirent.name}/index.js`; // 相对当前模块，不需要 pathToFileURL / fileURLToPath
        try {
            await import(spec);
            logger.debug(`Loaded module: ${dirent.name}`);
        } catch (error) {
            logger.error(`Failed to load module ${dirent.name}:`, error);
        }
    }
}