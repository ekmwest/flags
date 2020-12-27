import { DB, build, path } from "./deps.js";

const rootPath = Deno.cwd();

const sourcePath = path.join(rootPath, 'src');
const buildPath = path.join(rootPath, 'docs');
const snippetsPath = path.join(sourcePath, 'snippets');

const svgPath = path.join(rootPath, 'data/svg');
const jsonDataFile = path.join(buildPath, 'countries.json');
const jsDataFile = path.join(buildPath, 'countries.js');
const siteUrl = 'https://flags.ekmwest.io';

copySvgs();
await buildFlagsComponents();
build({ sourcePath, buildPath, snippetsPath });
buildDataFiles();

async function copySvgs() {
    for await (const dirEntry of Deno.readDir(svgPath)) {
        const buildFilePath = path.join(buildPath, dirEntry.name);
        const buildExists = await exists(buildFilePath);

        if (buildExists) {
            continue;
        }

        const sourceFilePath = path.join(svgPath, dirEntry.name);

        Deno.copyFile(sourceFilePath, buildFilePath);
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

    await Deno.writeTextFile(path.join(snippetsPath, "flags.html"), htmlElements.join(''));

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
            independent: independent ? true : false,
            flag_url: `${siteUrl}/${code.toLowerCase()}.svg`
        });
    }

    Deno.writeTextFile(jsonDataFile, JSON.stringify(countries, null, 4));

    Deno.writeTextFile(jsDataFile, 'export let countries = ' + JSON.stringify(countries, null, 4) + ';');

    db.close();
}