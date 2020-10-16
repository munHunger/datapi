import fs from "fs";
import { fix_and_destroy_block } from "svelte/internal";

let base = `${__dirname}/../../../doc/`

let md = fs.readFileSync(
  `${__dirname}/../../../doc/architecture/freebet.md`,
  "utf-8"
);
let topics = [];

function readDir(dir) {
  let topics = [];
  let dirs = fs.readdirSync(dir).filter(item => fs.statSync(dir + item).isDirectory());
  let files = fs.readdirSync(dir).filter(item => fs.statSync(dir + item).isFile()).filter(item => item.endsWith(".md"));
  topics = topics.concat(dirs.map(sub => ({name: sub, children: readDir(dir + sub + '/')}))).concat(files);
  return topics;
}
topics = readDir(base);

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(topics));
}
