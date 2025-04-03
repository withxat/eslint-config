import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '@/types'
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '@/vender/prettier-types'

import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import { StylisticConfigDefaults } from '@/configs/stylistic'
import { GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SVG, GLOB_XML } from '@/globs'
import { interopDefault, loadPrettierPlugin, parserPlain } from '@/utils'

const require = createRequire(fileURLToPath(import.meta.url))

function mergePrettierOptions(
	options: VendoredPrettierOptions,
	overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
	return {
		...options,
		...overrides,
		plugins: [
			...(overrides.plugins || []),
			...(options.plugins || []),
		],
	}
}

export async function formatters(
	options: OptionsFormatters | true = {},
	stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
	if (typeof options === 'boolean' && options) {
		options = {
			css: true,
			graphql: true,
			html: true,
			markdown: true,
			svg: true,
			xml: true,
		}
	}

	const {
		indent,
		quotes,
		semi,
	} = {
		...StylisticConfigDefaults,
		...stylistic,
	}

	const prettierOptions: VendoredPrettierOptions = Object.assign(
		{
			endOfLine: 'auto',
			printWidth: 120,
			semi,
			singleQuote: quotes === 'single',
			tabWidth: typeof indent === 'number' ? indent : 2,
			trailingComma: 'all',
			useTabs: indent === 'tab',
		} satisfies VendoredPrettierOptions,
		options.prettierOptions || {},
	)

	const prettierXmlOptions: VendoredPrettierOptions = {
		xmlQuoteAttributes: 'double',
		xmlSelfClosingSpace: true,
		xmlSortAttributesByKey: false,
		xmlWhitespaceSensitivity: 'ignore',
	}

	const dprintOptions = Object.assign(
		{
			indentWidth: typeof indent === 'number' ? indent : 2,
			quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble',
			useTabs: indent === 'tab',
		},
		options.dprintOptions || {},
	)

	const pluginFormat = await interopDefault(import('eslint-plugin-format'))

	const configs: TypedFlatConfigItem[] = [
		{
			name: 'xat/formatter/setup',
			plugins: {
				format: pluginFormat,
			},
		},
	]

	if (options.css) {
		configs.push(
			{
				files: [GLOB_CSS, GLOB_POSTCSS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'xat/formatter/css',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'css',
						}),
					],
				},
			},
			{
				files: [GLOB_SCSS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'xat/formatter/scss',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'scss',
						}),
					],
				},
			},
			{
				files: [GLOB_LESS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'xat/formatter/less',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'less',
						}),
					],
				},
			},
		)
	}

	if (options.html) {
		configs.push({
			files: [GLOB_HTML],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/html',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'html',
					}),
				],
			},
		})
	}

	const prettierXml = loadPrettierPlugin('@prettier/plugin-xml', require)

	if (options.xml) {
		configs.push({
			files: [GLOB_XML],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/xml',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
						parser: 'xml',
						plugins: [
							prettierXml,
						],
					}),
				],
			},
		})
	}
	if (options.svg) {
		configs.push({
			files: [GLOB_SVG],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/svg',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
						parser: 'xml',
						plugins: [
							prettierXml,
						],
					}),
				],
			},
		})
	}

	if (options.markdown) {
		const formater = options.markdown === true
			? 'prettier'
			: options.markdown

		configs.push({
			files: [GLOB_MARKDOWN],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/markdown',
			rules: {
				[`format/${formater}`]: [
					'error',
					formater === 'prettier'
						? mergePrettierOptions(prettierOptions, {
								embeddedLanguageFormatting: 'off',
								parser: 'markdown',
							})
						: {
								...dprintOptions,
								language: 'markdown',
							},
				],
			},
		})
	}

	if (options.graphql) {
		configs.push({
			files: [GLOB_GRAPHQL],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/graphql',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'graphql',
					}),
				],
			},
		})
	}

	return configs
}
