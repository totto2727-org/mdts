import { describe, expect, test } from 'vite-plus/test'

import { formatLintResult } from './format.ts'

describe('CLI lint output', () => {
  test('prints source positions and engine rule identifiers', () => {
    // When
    const output = formatLintResult({
      diagnostics: [
        {
          column: 1,
          engine: 'markdownlint',
          filePath: 'content/lint-target.md.ts',
          line: 7,
          message: 'Line length exceeds the configured limit',
          ruleId: 'MD013',
          scope: 'file',
          severity: 'error',
          target: 'source',
        },
        {
          column: 3,
          engine: 'textlint',
          filePath: 'content/lint-target.md.ts',
          line: 8,
          message: 'Avoid the forbidden word',
          ruleId: 'writing/no-forbidden-word',
          scope: 'file',
          severity: 'warning',
          target: 'source',
        },
      ],
      errorCount: 1,
    })

    // Then
    expect(output).toBe(
      'content/lint-target.md.ts:7:1 error Line length exceeds the configured limit (markdownlint/MD013)\n' +
        'content/lint-target.md.ts:8:3 warning Avoid the forbidden word (textlint/writing/no-forbidden-word)',
    )
    expect(output).toContain('content/lint-target.md.ts:7:')
    expect(output).toContain('(markdownlint/MD013)')
  })

  test('prints unreachable document diagnostics', () => {
    // When
    const output = formatLintResult({
      diagnostics: [
        {
          column: 1,
          engine: 'knip',
          filePath: 'content/nested/orphan.md.ts',
          line: 1,
          message: 'Markdown source file is not reachable from an entry document',
          ruleId: 'files',
          scope: 'project',
          severity: 'error',
          target: 'source',
        },
      ],
      errorCount: 1,
    })

    // Then
    expect(output).toBe(
      'content/nested/orphan.md.ts:1:1 error Markdown source file is not reachable from an entry document (knip/files)',
    )
  })

  test('prints nothing when core returns no diagnostics', () => {
    expect(formatLintResult({ diagnostics: [], errorCount: 0 })).toBe('')
  })
})
