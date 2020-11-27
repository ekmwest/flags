import * as path from "https://deno.land/std@0.79.0/path/mod.ts";
import { sideBuild } from "https://cdn.jsdelivr.net/gh/ekmwest/side@1.1.2/mod.js";
import { DB } from "https://deno.land/x/sqlite@v2.3.0/mod.ts";

const rootPath = Deno.cwd();
const sourcePath = path.join(rootPath, 'src');
const targetPath = path.join(rootPath, 'docs');
const componentsPath = path.join(sourcePath, 'components');
const svgPath = path.join(rootPath, 'data/svg');
const jsonDataFile = path.join(targetPath, 'countries.json');
const jsDataFile = path.join(targetPath, 'countries.js');
const siteUrl = 'https://flags.ekmwest.io';

copySvgs();
await buildFlagsComponents();
sideBuild(sourcePath, targetPath, componentsPath, false);
buildDataFiles();

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
                <img class="flag" src="/${code.toLowerCase()}.svg" alt="${common_name}" />
                <span class="country-name">${common_name}</span>
            </div>
        </div>`);
    }

    await Deno.writeTextFile(path.join(componentsPath, "flags.html"), htmlElements.join(''));

    db.close();
}

async function exists(filePath) {
    try {
        await Deno.lstat(filePath);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }

        throw err;
    }
}

async function buildDataFiles() {
    const db = new DB('data/countries.db');

    const countries = [];

    for (const [code, name, common_name, independent] of db.query("SELECT code, name, common_name, independent FROM countries ORDER BY code")) {

        countries.push({
            code: code,
            name: name,
            common_name: common_name,
            independent: independent,
            flag_url: `${siteUrl}/${code.toLowerCase()}.svg`
        });
    }

    Deno.writeTextFile(jsonDataFile, JSON.stringify(countries, null, 4));

    Deno.writeTextFile(jsDataFile, 'export let countries = ' + JSON.stringify(countries, null, 4) + ';');

    db.close();
}