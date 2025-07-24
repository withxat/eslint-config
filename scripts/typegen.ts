import fs from 'node:fs/promises'

import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import { astro, combine, comments, formatters, imports, javascript, jsdoc, jsonc, jsx, markdown, nextjs, node, paths, perfectionist, react, regexp, sortPackageJson, stylistic, test, toml, typescript, unicorn, yaml } from '@/index'

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	astro(),
	comments(),
	formatters(),
	imports(),
	javascript(),
	jsx(),
	jsdoc(),
	jsonc(),
	markdown(),
	node(),
	perfectionist(),
	paths(),
	nextjs(),
	react(),
	sortPackageJson(),
	stylistic(),
	test(),
	toml(),
	regexp(),
	typescript(),
	unicorn(),
	yaml(),
)

const configNames = configs.map(i => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`

await fs.writeFile('src/typegen.d.ts', dts)
