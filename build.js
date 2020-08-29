import * as path from "https://deno.land/std@0.66.0/path/mod.ts";
import { exists } from "https://deno.land/std@0.66.0/fs/mod.ts";
import { sideBuild } from "https://cdn.jsdelivr.net/gh/ekmwest/side@1.0.4/mod.js";
import { DB } from "https://deno.land/x/sqlite@v2.3.0/mod.ts";

const rootPath = Deno.cwd();
const sourcePath = path.join(rootPath, 'src');
const targetPath = path.join(rootPath, 'docs');
const componentsPath = path.join(sourcePath, 'components');
const svgPath = path.join(rootPath, 'data/svg');

copySvgs();
await buildFlagsComponents();
sideBuild(sourcePath, targetPath, componentsPath, false);

async function copySvgs() {
    for await (const dirEntry of Deno.readDir(svgPath)) {
        const targetFilePath = path.join(targetPath, dirEntry.name);
        const targetExists = await exists(targetFilePath);

        if (targetExists) {
            continue;
        }

        const sourceFilePath = path.join(svgPath, dirEntry.name);

        Deno.copyFile(sourceFilePath, targetFilePath);
    }
}

async function buildFlagsComponents() {
    const db = new DB('data/countries.db');

    const htmlElements = [];

    for (const [code, common_name] of db.query("SELECT code, common_name FROM countries ORDER BY common_name")) {

        htmlElements.push(`
        <div>
            <div class="flag-container">
                <img class="flag" src="/${code}.svg" alt="${common_name}" />
                <span class="country-name">${common_name}</span>
            </div>
        </div>`);
    }

    await Deno.writeTextFile(path.join(componentsPath, "flags.html"), htmlElements.join(''));

    db.close();
}
