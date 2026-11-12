import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { seedClean } from "../src/lib/db";

const dataDir = join(process.cwd(), "data");
const dataFile = join(dataDir, "aliento.json");

mkdirSync(dataDir, { recursive: true });
writeFileSync(dataFile, JSON.stringify(seedClean(), null, 2));
console.log(`Clean store written to ${dataFile}`);
