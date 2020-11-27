import * as path from "https://deno.land/std@0.79.0/path/mod.ts";
import { serv } from "https://cdn.jsdelivr.net/gh/ekmwest/serv@2.2.2/serv.js";

serv(path.join(Deno.cwd(), 'docs'));
