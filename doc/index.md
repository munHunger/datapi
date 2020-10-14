{
title: "datapi"
}

# datapi

## sub header?

{
subtitle: "datapi 2.0"
}

This is some markdown
it can be _bold_.
it can also have `special` strings.
it can however not have a # header mid line

And if requested it can have

of course [links](./here) are also possible

```
code blocks
```

additionally it can have language specific code blocks

```javascript
function flattenRule(rule) {
  return rule.tokens
    .map((token) => {
      if (token instanceof RegExp) return token.source;
      return flattenRule(token);
    })
    .join("");
}
```
