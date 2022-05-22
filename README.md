# Flags

A collection of flags for the entries in [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1).

- All flags can be viewed at https://flags.ekmwest.io

- Each flag is located at ```https://flags.ekmwest.io/flags/[(Alpha-2).toLowerCase()].svg```. For example, the swedish flag is located at https://flags.ekmwest.io/flags/se.svg.

- A JSON data file is available at https://flags.ekmwest.io/countries.json

- A JavaScript array can be imported from https://flags.ekmwest.io/countries.js

    ```js
    import { countries } from "https://flags.ekmwest.io/countries.js";
    ```

# Development Process

1. Edit the database `data/countries.db`.
2. Edit the flag files in `data/flags`.
3. Run the build command `deno run -A build.js`.
4. Make site edits.
5. Start the dev server `piko dev`.