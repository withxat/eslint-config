import type { TypedFlatConfigItem } from '@/types'

import { GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_BARREL, GLOB_MARKDOWN_CODE, GLOB_SRC } from '@/globs'
import { interopDefault } from '@/utils'

export async function paths(): Promise<TypedFlatConfigItem[]> {
	const [
		pluginPaths,
	] = await Promise.all([
		interopDefault(import('@limegrass/eslint-plugin-import-alias')),
	])

	return [
		{
			name: 'xat/prefer/setup',
			plugins: {
				paths: pluginPaths,
			},
		},
		{
			files: [GLOB_SRC, GLOB_ASTRO],
			ignores: [
				GLOB_BARREL,
				GLOB_MARKDOWN_CODE,
				GLOB_ASTRO_TS,
			],
			name: 'xat/prefer/import-alias',
			rules: {
				'paths/import-alias': 'error',
			},
		},
	]
}
