export interface PromItem<T> {
	hint?: string
	label: string
	value: T
}

export type FrameworkOption = 'astro' | 'react' | 'slidev' | 'solid' | 'svelte' | 'vue'

export type ExtraLibrariesOption = 'formatter' | 'unocss'

export interface PromptResult {
	extra: ExtraLibrariesOption[]
	frameworks: FrameworkOption[]
	uncommittedConfirmed: boolean
	updateVscodeSettings: unknown
}
