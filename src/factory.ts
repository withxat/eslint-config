import type { Linter } from 'eslint'

import type { RuleOptions } from '@/typegen'
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from '@/types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'

import {
	astro,
	comments,
	disables,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	markdown,
	nextjs,
	node,
	paths,
	perfectionist,
	react,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	test,
	toml,
	typescript,
	unicorn,
	yaml,
} from '@/configs'
import { formatters } from '@/configs/formatters'
import { regexp } from '@/configs/regexp'
import { interopDefault, isInEditorEnv } from '@/utils'

const flatConfigProps = [
	'name',
	'languageOptions',
	'linterOptions',
	'processor',
	'plugins',
	'rules',
	'settings',
] satisfies (keyof TypedFlatConfigItem)[]

export const defaultPluginRenaming = {
	'@eslint-react': 'react',
	'@eslint-react/dom': 'react-dom',
	'@eslint-react/hooks-extra': 'react-hooks-extra',
	'@eslint-react/naming-convention': 'react-naming-convention',

	'@stylistic': 'style',
	'@typescript-eslint': 'ts',
	'import-lite': 'import',
	'n': 'node',
	'vitest': 'test',
	'yml': 'yaml',
}

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function xat(
	options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
	...userConfigs: Awaitable<FlatConfigComposer<any, any> | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const {
		astro: enableAstro = isPackageExists('astro'),
		autoRenamePlugins = true,
		componentExts = [],
		formatters: enableFormatters = true,
		gitignore: enableGitignore = true,
		imports: enableImports = true,
		jsx: enableJsx = true,
		nextjs: enableNextjs = isPackageExists('next'),
		paths: enablePaths = true,
		react: enableReact = isPackageExists('react'),
		regexp: enableRegexp = true,
		typescript: enableTypeScript = isPackageExists('typescript'),
		unicorn: enableUnicorn = true,
	} = options

	let isInEditor = options.isInEditor
	if (isInEditor == null) {
		isInEditor = isInEditorEnv()
		if (isInEditor)
		// eslint-disable-next-line no-console
			console.log('[@xats/eslint-config] Detected running in editor, some rules are disabled.')
	}

	const stylisticOptions = options.stylistic === false
		? false
		: typeof options.stylistic === 'object'
			? options.stylistic
			: {}

	if (stylisticOptions && !('jsx' in stylisticOptions))
		stylisticOptions.jsx = enableJsx

	const configs: Awaitable<TypedFlatConfigItem[]>[] = []

	if (enableGitignore) {
		if (typeof enableGitignore !== 'boolean') {
			configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
				name: 'xat/gitignore',
				...enableGitignore,
			})]))
		}
		else {
			configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
				name: 'xat/gitignore',
				strict: false,
			})]))
		}
	}

	const typescriptOptions = resolveSubOptions(options, 'typescript')
	const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

	// Base configs
	configs.push(
		ignores(options.ignores),
		javascript({
			isInEditor,
			overrides: getOverrides(options, 'javascript'),
		}),
		comments(),
		node(),
		jsdoc({
			stylistic: stylisticOptions,
		}),
		imports({
			stylistic: stylisticOptions,
		}),
		perfectionist(),
	)

	if (enableUnicorn) {
		configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn))
	}

	if (enableJsx) {
		configs.push(jsx())
	}

	if (enableImports) {
		configs.push(
			imports(enableImports === true
				? {
						stylistic: stylisticOptions,
					}
				: {
						stylistic: stylisticOptions,
						...enableImports,
					}),
		)
	}

	if (enableTypeScript) {
		configs.push(typescript({
			...typescriptOptions,
			componentExts,
			overrides: getOverrides(options, 'typescript'),
			type: options.type,
		}))
	}

	if (stylisticOptions) {
		configs.push(stylistic({
			...stylisticOptions,
			overrides: getOverrides(options, 'stylistic'),
		}))
	}

	if (enableRegexp) {
		configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
	}

	if (options.test ?? true) {
		configs.push(test({
			isInEditor,
			overrides: getOverrides(options, 'test'),
		}))
	}

	if (enableReact) {
		configs.push(react({
			...typescriptOptions,
			overrides: getOverrides(options, 'react'),
			tsconfigPath,
		}))
	}

	if (enableNextjs) {
		configs.push(nextjs({
			overrides: getOverrides(options, 'nextjs'),
		}))
	}

	if (enableAstro) {
		configs.push(astro({
			overrides: getOverrides(options, 'astro'),
			stylistic: stylisticOptions,
		}))
	}

	if (enablePaths) {
		configs.push(paths())
	}

	if (options.jsonc ?? true) {
		configs.push(
			jsonc({
				overrides: getOverrides(options, 'jsonc'),
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsconfig(),
		)
	}

	if (options.yaml ?? true) {
		configs.push(yaml({
			overrides: getOverrides(options, 'yaml'),
			stylistic: stylisticOptions,
		}))
	}

	if (options.toml ?? true) {
		configs.push(toml({
			overrides: getOverrides(options, 'toml'),
			stylistic: stylisticOptions,
		}))
	}

	if (options.markdown ?? true) {
		configs.push(
			markdown(
				{
					componentExts,
					overrides: getOverrides(options, 'markdown'),
				},
			),
		)
	}

	if (enableFormatters) {
		configs.push(formatters(
			enableFormatters,
			typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
		))
	}

	configs.push(
		disables(),
	)

	if ('files' in options) {
		throw new Error('[@xats/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.')
	}

	// User can optionally pass a flat config item to the first argument
	// We pick the known keys as ESLint would do schema validation
	const fusedConfig = flatConfigProps.reduce((acc, key) => {
		if (key in options)
			acc[key] = options[key] as any
		return acc
	}, {} as TypedFlatConfigItem)
	if (Object.keys(fusedConfig).length)
		configs.push([fusedConfig])

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

	composer = composer
		.append(
			...configs,
			...userConfigs as any,
		)

	if (autoRenamePlugins) {
		composer = composer
			.renamePlugins(defaultPluginRenaming)
	}

	if (isInEditor) {
		composer = composer
			.disableRulesFix([
				'unused-imports/no-unused-imports',
				'test/no-only-tests',
				'prefer-const',
			], {
				builtinRules: () => import(['eslint', 'use-at-your-own-risk'].join('/')).then(r => r.builtinRules),
			})
	}

	return composer
}

export type ResolvedOptions<T> = T extends boolean
	? never
	: NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): ResolvedOptions<OptionsConfig[K]> {
	return typeof options[key] === 'boolean'
		? {} as any
		: options[key] || {} as any
}

export function getOverrides<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): Partial<RuleOptions & Linter.RulesRecord> {
	const sub = resolveSubOptions(options, key)
	return {
		...'overrides' in sub
			? sub.overrides
			: {},
	}
}
