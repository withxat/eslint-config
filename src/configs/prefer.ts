import type { TypedFlatConfigItem } from '@/types'

import { GLOB_BARREL, GLOB_MARKDOWN_CODE, GLOB_SRC } from '@/globs'
import { interopDefault } from '@/utils'

export async function prefer(): Promise<TypedFlatConfigItem[]> {
  const [
    pluginPrefer,
  ] = await Promise.all([
    interopDefault(import('@limegrass/eslint-plugin-import-alias')),
  ])

  return [
    {
      files: [GLOB_SRC],
      ignores: [
        GLOB_BARREL,
        GLOB_MARKDOWN_CODE,
      ],
      name: 'xat/prefer/import-alias',
      plugins: {
        'import-alias': pluginPrefer,
      },
      rules: {
        'import-alias/import-alias': 'error',
      },
    },
  ]
}
