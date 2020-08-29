import * as path from "https://deno.land/std@0.67.0/path/mod.ts";
import { serv } from "https://cdn.jsdelivr.net/gh/ekmwest/serv@2.0.8/serv.js";

serv(path.join(Deno.cwd(), 'docs'));
