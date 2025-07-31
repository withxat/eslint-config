# @withxat/eslint-config

[![npm](https://img.shields.io/npm/v/@withxat/eslint-config?color=444&label=)](https://npmjs.com/package/@withxat/eslint-config) [![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

## How is this different from [antfu/eslint-config](https://github.com/antfu/eslint-config)?

Well, this is a fork of [antfu/eslint-config](https://github.com/antfu/eslint-config) with some modifications to fit my personal needs.

I will _randomly_ update it to keep up with upstream changes.

Let me just list the main differences:

1. This is an **ESM only** package.
2. Automatically enables plugins and rules based on `package.json` dependencies. \
   This increases the package's size a bit, but it's more convenient to use.
3. Removed support for some languages that I don't use, such as Vue, Svelte, UnoCSS, etc.
4. Prefers `tab` over `space` for indentation.
5. Removed antfu's `cli` tool.

## Features

- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Reasonable defaults, best practices, only one line of config
- Designed to work with TypeScript, JSX, JSON, YAML, Toml, Markdown, etc. Out-of-box.
- Opinionated, but [very customizable](#customization)
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Optional [React](#react), [Next.js](#nextjs), [Astro](#astro) support
- Optional [formatters](#formatters) support for formatting CSS, HTML, XML, etc.
- **Style principle**: Minimal for reading, stable for diff, consistent
  - Sorted imports, dangling commas
  - Single quotes, no semi
  - Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Requires ESLint v9.29.0+

## Usage

```bash
pnpm i -D eslint @withxat/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import { xat } from '@withxat/eslint-config'

export default xat()
```

### Add script for package.json

For example:

```json
{
	"scripts": {
		"lint": "eslint",
		"lint:fix": "eslint --fix"
	}
}
```

## IDE Support (auto fix on save)

<details>
<summary>🟦 VS Code support</summary>

<br>

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
	// Disable the default formatter, use eslint instead
	"prettier.enable": false,
	"editor.formatOnSave": false,

	// Auto fix
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit",
		"source.organizeImports": "never"
	},

	// Silent the stylistic rules in you IDE, but still auto fix them
	"eslint.rules.customizations": [
		{ "rule": "style/*", "severity": "off", "fixable": true },
		{ "rule": "format/*", "severity": "off", "fixable": true },
		{ "rule": "*-indent", "severity": "off", "fixable": true },
		{ "rule": "*-spacing", "severity": "off", "fixable": true },
		{ "rule": "*-spaces", "severity": "off", "fixable": true },
		{ "rule": "*-order", "severity": "off", "fixable": true },
		{ "rule": "*-dangle", "severity": "off", "fixable": true },
		{ "rule": "*-newline", "severity": "off", "fixable": true },
		{ "rule": "*quotes", "severity": "off", "fixable": true },
		{ "rule": "*semi", "severity": "off", "fixable": true }
	],

	// Enable eslint for all supported languages
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"html",
		"markdown",
		"json",
		"jsonc",
		"yaml",
		"toml",
		"xml",
		"gql",
		"graphql",
		"astro",
		"css",
		"less",
		"scss",
		"pcss",
		"postcss"
	]
}
```

</details>

<details>
<summary>🟩 Neovim Support</summary>

<br>

Update your configuration to use the following:

```lua
local customizations = {
  { rule = 'style/*', severity = 'off', fixable = true },
  { rule = 'format/*', severity = 'off', fixable = true },
  { rule = '*-indent', severity = 'off', fixable = true },
  { rule = '*-spacing', severity = 'off', fixable = true },
  { rule = '*-spaces', severity = 'off', fixable = true },
  { rule = '*-order', severity = 'off', fixable = true },
  { rule = '*-dangle', severity = 'off', fixable = true },
  { rule = '*-newline', severity = 'off', fixable = true },
  { rule = '*quotes', severity = 'off', fixable = true },
  { rule = '*semi', severity = 'off', fixable = true },
}

local lspconfig = require('lspconfig')
-- Enable eslint for all supported languages
lspconfig.eslint.setup(
  {
    filetypes = {
      "javascript",
      "javascriptreact",
      "javascript.jsx",
      "typescript",
      "typescriptreact",
      "typescript.tsx",
      "html",
      "markdown",
      "json",
      "jsonc",
      "yaml",
      "toml",
      "xml",
      "gql",
      "graphql",
      "astro",
      "css",
      "less",
      "scss",
      "pcss",
      "postcss"
    },
    settings = {
      -- Silent the stylistic rules in you IDE, but still auto fix them
      rulesCustomizations = customizations,
    },
  }
)
```

### Neovim format on save

There's few ways you can achieve format on save in neovim:

- `nvim-lspconfig` has a `EslintFixAll` command predefined, you can create a autocmd to call this command after saving file.

```lua
lspconfig.eslint.setup({
  --- ...
  on_attach = function(client, bufnr)
    vim.api.nvim_create_autocmd("BufWritePre", {
      buffer = bufnr,
      command = "EslintFixAll",
    })
  end,
})
```

- Use [conform.nvim](https://github.com/stevearc/conform.nvim).
- Use [none-ls](https://github.com/nvimtools/none-ls.nvim)
- Use [nvim-lint](https://github.com/mfussenegger/nvim-lint)

</details>

## Customization

I haven't modified the config builder part much, so you can customize it according to the [antfu/eslint-config](https://github.com/antfu/eslint-config#Customization) documentation.

Just remember to use `xat` instead of `antfu`.

## Check Also

- [antfu/eslint-config](https://github.com/antfu/eslint-config) - Anthony Fu's ESLint Config

## License

[MIT](./LICENSE) License\
&copy; 2019-2025 [Anthony Fu](https://github.com/antfu)\
&copy; 2025-PRESENT [Xat](https://github.com/withxat)
