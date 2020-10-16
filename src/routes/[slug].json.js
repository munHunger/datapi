import fs from "fs";

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
  tokens: [/(?<=\s)/, /(\*|_){2}/, /[^\*_]+?/, /(\*|_){2}/, /(?=\s)/],
  post: (input) => ({ part: input.substring(2, input.length - 2) }),
};

let italic = {
  name: "ITALIC",
  tokens: [/(?<=\s)/, /(\*|_){1}/, /[^\*_]+?/, /(\*|_){1}/, /(?=\s)/],
  post: (input) => ({ part: input.substring(1, input.length - 1) }),
};

let newLine = {
  name: "NEW_LINE",
  tokens: [/\n{2}/],
};

let link = {
  name: "LINK",
  tokens: [/\[/, literal, /\]/, /\(/, literal, /\)/],
  post: (input) => {
    let link = {
      name: input.substring(1, input.indexOf("]")),
      url: input.substring(input.indexOf("(") + 1, input.indexOf(")")),
    };
    if (link.url.startsWith("/")) {
      let url = link.url
        .substring(1, link.url.indexOf("#"))
        .replace(/\//g, "-");
      let header = link.url.substring(link.url.indexOf("#") + 1);
      let linkProp = getMD(url)
        .filter((part) => part.type === "PROPERTY_BLOCK")
        .map((part) => JSON.parse(part.part))
        .find((part) => part.link === header);
      if (linkProp.popup) link.popup = parse(linkProp.popup);
    }
    return link;
  },
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
  tokens: [/(?<=\s)/, /`(?!`+?)/, literal, /`/],
  post: (input) => ({ part: input.substring(1, input.length - 1) }),
};

let codeblock = {
  name: "CODEBLOCK",
  tokens: [startOfLine, /`{3}(\w+?)?\n/, literal, startOfLine, /`{3}\n/],
  post: (input) => ({
    parts: input
      .substring(3, input.length - 4)
      .split(/\n---/)
      .map((part) => ({
        part: part.substring(part.indexOf("\n") + 1),
        lang: part.substring(0, part.indexOf("\n")),
      })),
  }),
};

let propertyBlock = {
  name: "PROPERTY_BLOCK",
  tokens: [startOfLine, /{\n/, literal, startOfLine, /}\n/],
};

let rules = [
  codeblock,
  header,
  link,
  bold,
  italic,
  propertyBlock,
  special,
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

function getRegexMatches(text, regexp) {
  let m;
  let result = [];
  do {
    m = regexp.exec(text);
    if (m) {
      result.push({ match: m[0], index: m.index });
    }
  } while (m);
  return result;
}

function compile(parts) {
  let res = [];
  let index = 0;
  let part;
  do {
    part = parts.find((part) => part.reg.find((reg) => reg.index === index));
    if (!part) break;
    res.push({
      type: part.name,
      post: part.post,
      reg: part.reg.find((reg) => reg.index === index),
    });
    index += res[res.length - 1].reg.match.length;
  } while (part);
  return res;
}

function parse(text) {
  if (text.length === 0) return null;
  let part = rules
    .map((rule) => ({
      reg: getRegexMatches(text, new RegExp(flattenRule(rule), "gs")),
      ...rule,
      flattened: flattenRule(rule),
    }))
    .filter((r) => r.reg);
  part = compile(part);

  part = part
    .map((p) => ({ type: p.type, post: p.post, part: p.reg.match }))
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

  return part;
}

function getMD(url) {
  return parse(
    fs.readFileSync(
      `${__dirname}/../../../doc/${url.replace(/-/g, "/")}.md`,
      "utf-8"
    )
  );
}

export function get(req, res) {
  const { slug } = req.params;

  // console.log(slug);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(getMD(slug)));
}
