import fs from "fs";

let md = fs.readFileSync(`${__dirname}/../../../doc/index.md`, "utf-8");

let literal = {
  name: "LITERAL",
  tokens: [/.+?/],
};

let startOfLine = {
  name: "START_OF_LINE",
  tokens: [/(?<=^|\n)/],
};

let bold = {
  name: "BOLD",
  tokens: [/(\*|_)/, literal, /(\*|_)/],
  post: (input) => ({ part: input.substring(1, input.length - 2) }),
};

let newLine = {
  name: "NEW_LINE",
  tokens: [/\n{2}/],
};

let link = {
  name: "LINK",
  tokens: [/\[/, literal, /\]/, /\(/, literal, /\)/],
  post: (input) => ({
    name: input.substring(1, input.indexOf("]")),
    url: input.substring(input.indexOf("(") + 1, input.indexOf(")")),
  }),
};

let header = {
  name: "HEADER",
  tokens: [startOfLine, /#+/, literal, /\n/],
  post: (input) => {
    let level = (input.match(/#/g) || []).length;
    let part = input.substring(level);
    return { part, level };
  },
};

let special = {
  name: "SPECIAL",
  tokens: [/`(?!`+?)/, literal, /`/],
};

let codeblock = {
  name: "CODEBLOCK",
  tokens: [startOfLine, /`{3}(\w+?)?\n/, literal, startOfLine, /`{3}\n/],
};

let propertyBlock = {
  name: "PROPERTY_BLOCK",
  tokens: [startOfLine, /{\n/, literal, startOfLine, /}\n/],
};

let rules = [
  header,
  special,
  link,
  bold,
  propertyBlock,
  codeblock,
  newLine,
  literal,
];

function flattenRule(rule) {
  return rule.tokens
    .map((token) => {
      if (token instanceof RegExp) return token.source;
      return flattenRule(token);
    })
    .join("");
}

function parse(text) {
  if (text.length === 0) return null;
  let part = rules
    .map((rule) => ({
      reg: new RegExp(flattenRule(rule), "gs").exec(text),
      ...rule,
      flattened: flattenRule(rule),
    }))
    .filter((r) => r.reg)
    .find((r) => r.reg.index === 0);

  if (!part) return parse(text.substring(1));
  return [{ type: part.name, part: part.reg[0], post: part.post }]
    .concat(parse(text.substring(part.reg[0].length)))
    .filter((v) => v)
    .reduce((acc, val) => {
      if ((acc[acc.length - 1] || {}).type === val.type) {
        acc[acc.length - 1].part += val.part;
        return acc;
      }
      return acc.concat(val);
    }, [])
    .map((p) => {
      if (p.post) return { ...p, ...p.post(p.part) };
      return p;
    });
}

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(parse(md)));
}
