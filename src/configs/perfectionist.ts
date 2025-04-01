import type { TypedFlatConfigItem } from '@/types'

import { pluginPerfectionist } from '@/plugins'

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: 'xat/perfectionist/setup',
			plugins: {
				perfectionist: pluginPerfectionist,
			},
			rules: {
				'perfectionist/sort-enums': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-imports': ['error', {
					groups: [
						'type',
						'builtin-type',
						'external-type',
						['parent-type', 'sibling-type', 'index-type', 'internal-type'],

						'builtin',
						'external',
						'internal',
						['parent', 'sibling', 'index', 'internal'],
						['side-effect', 'side-effect-style'],
						'object',
						'unknown',
					],
					internalPattern: ['^~/.*', '^@/.*', '^#/.*'],
					newlinesBetween: 'always',
					order: 'asc',
					type: 'natural',
				}],
				'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-intersection-types': ['error', { order: 'asc', type: 'line-length' }],
				'perfectionist/sort-jsx-props': ['error', {
					groups: [
						'multiline',
						'shorthand',
						'unknown',
					],
					order: 'asc',
					type: 'natural',
				}],
				'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-object-types': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-objects': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-union-types': ['error', { order: 'asc', type: 'natural' }],
			},
		},
	]
}
