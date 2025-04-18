import type { Linter } from "eslint";

function eslintSeverityToNovaSeverity(severity: Linter.Severity) {
	const issueSev = [IssueSeverity.Info, IssueSeverity.Warning, IssueSeverity.Error];
	const lowSev = nova.config.get("com.parkcedar.eslint.config.lowSeverity", "boolean")

	// Downgrades errors to warnings and warnings to info. Info stays as info.
	// Used when strict eslint checks are enabled and you want to quiet down the IDE
	// so you can actually spot really TS errors.
	if (lowSev && severity > 0) {
		severity--
	}

	return issueSev[severity];
}

export function eslintOutputToIssue(attributes: Linter.LintMessage) {
	const issue = new Issue();

	issue.source = "ESLint";
	if (attributes.ruleId) {
		issue.code = attributes.ruleId;
	}
	issue.message = attributes.message;
	issue.severity = eslintSeverityToNovaSeverity(attributes.severity);
	issue.line = attributes.line;
	issue.endLine = attributes.endLine;
	issue.column = attributes.column;
	issue.endColumn = attributes.endColumn;

	return issue;
}
