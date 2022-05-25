import { DB, path } from "./deps.js";

const rootPath = Deno.cwd();

const sourcePath = path.join(rootPath, 'src');
const includesPath = path.join(sourcePath, '_includes');

const flagsDataPath = path.join(rootPath, 'data/flags');
const flagsSourcePath = path.join(sourcePath, 'flags');

const jsonDataFile = path.join(sourcePath, 'countries.json');
const jsDataFile = path.join(sourcePath, 'countries.js');

const flagUrl = code => `https://flags.ekmwest.io/flags/${code.toLowerCase()}.svg`;

await build();

async function build() {
    const countries = await createCountriesFromDB();
    await makeFlagsInclude(countries);
    await copyFlagsFromDataToSource();
    await buildDataFiles(countries);
}

async function createCountriesFromDB() {
    const countries = [];

    const db = new DB('data/countries.db');

    for (const [code, name, common_name, independent] of db.query("SELECT code, name, common_name, independent FROM countries ORDER BY common_name")) {

        countries.push({
            code,
            name,
            common_name,
            independent: independent ? true : false,
            flag_url: flagUrl(code)
        });
    }

    db.close();

    return countries;
}

async function makeFlagsInclude(countries) {
    const htmlElements = [];

    for (const country of countries) {
        htmlElements.push(`
        <div>
            <div class="flag-container">
                <img class="flag" src="/flags/${country.code.toLowerCase()}.svg" alt="${country.common_name}" />
                <span class="country-name">${country.common_name}</span>
            </div>
        </div>`);
    }

    const html = htmlElements.join('');

    await Deno.writeTextFile(path.join(includesPath, "flags.html"), html);
}

function createFlagsIncludeHTML(countries) {
    const htmlElements = [];

    for (const country of countries) {
        htmlElements.push(`
        <div>
            <div class="flag-container">
                <img class="flag" src="/flags/${country.code.toLowerCase()}.svg" alt="${country.common_name}" />
                <span class="country-name">${country.common_name}</span>
            </div>
        </div>`);
    }

    return htmlElements.join('');
}

async function copyFlagsFromDataToSource() {
    try {
        await Deno.remove(flagsSourcePath, { recursive: true });
    } catch (ex) {}

    await Deno.mkdir(flagsSourcePath);

    for await (const dirEntry of Deno.readDir(flagsDataPath)) {
        const sourceFlagPath = path.join(flagsSourcePath, dirEntry.name);
        const dataFlagPath = path.join(flagsDataPath, dirEntry.name);
        await Deno.copyFile(dataFlagPath, sourceFlagPath);
    }
}

async function buildDataFiles(countries) {
    await Deno.writeTextFile(jsDataFile, 'export let countries = ' + JSON.stringify(countries, null, 4) + ';');
    await Deno.writeTextFile(jsonDataFile, JSON.stringify(countries, null, 4));
}
