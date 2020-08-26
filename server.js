import * as path from "https://deno.land/std@0.66.0/path/mod.ts";
import { serv } from "https://cdn.jsdelivr.net/gh/ekmwest/serv@2.0.5/serv.js";

serv(path.join(Deno.cwd(), 'docs'));
