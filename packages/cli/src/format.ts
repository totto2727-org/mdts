import type { MdtsLintResult } from '@mdts/core/lint'

export const formatLintResult = (result: MdtsLintResult): string =>
  result.diagnostics
    .map(
      (diagnostic) =>
        `${diagnostic.filePath}:${diagnostic.line}:${diagnostic.column} ${diagnostic.severity} ${diagnostic.message} (${diagnostic.engine}/${diagnostic.ruleId})`,
    )
    .join('\n')
