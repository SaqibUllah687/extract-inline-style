#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { extract } from './index.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const args = process.argv.slice(2);

// --- Help & Version ---
if (args.includes('--help') || args.includes('-h')) {
	console.log(`
  Extract inline styles from HTML elements to a CSS file.

  Usage
    $ extract-inline-style <input.html> [output.css]

  Options
    --prefix, -p    Class name prefix (default: "eis-")
    --no-backup     Do not create a backup of the original HTML file
    --no-inject     Do not inject the <link> tag into HTML
    --version, -v   Show version
    --help, -h      Show help

  Examples
    $ extract-inline-style index.html
    (Generates index-extracted.css, updates index.html, injects <link>)

    $ extract-inline-style email.html custom.css
	`);
	process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
	console.log(pkg.version);
	process.exit(0);
}

// --- Inputs & Defaults ---
const rawInput = args[0];

if (!rawInput || rawInput.startsWith('-')) {
	console.error('❌ Error: Input HTML path is required.');
	console.error('Usage: extract-inline-style <input.html> [output.css]');
	process.exit(1);
}

const inputHtmlPath: string = rawInput;

// Auto-generate CSS filename if not provided
let outputCssPath: string;
const rawOutput = args[1];

if (!rawOutput || rawOutput.startsWith('-')) {
	const parsed = path.parse(inputHtmlPath);
	outputCssPath = path.join(parsed.dir, `${parsed.name}-extracted.css`);
} else {
	outputCssPath = rawOutput;
}

// --- Options ---
let classPrefix = 'eis-';
const prefixIndex = args.indexOf('--prefix') !== -1 ? args.indexOf('--prefix') : args.indexOf('-p');
if (prefixIndex !== -1 && args[prefixIndex + 1]) {
	classPrefix = args[prefixIndex + 1]!;
}

const skipBackup = args.includes('--no-backup');
const skipInject = args.includes('--no-inject');

try {
	if (!fs.existsSync(inputHtmlPath)) {
		throw new Error(`Input file not found: ${inputHtmlPath}`);
	}

	console.log(`🔍 Reading ${inputHtmlPath}...`);
	const htmlContent = fs.readFileSync(inputHtmlPath, 'utf8');

	// --- Core Logic ---
	const cssFileName = path.basename(outputCssPath);
	
	const result = extract(htmlContent, { 
		classPrefix,
		injectCssPath: skipInject ? undefined : `./${cssFileName}`
	});

	// --- Safety Backup ---
	if (!skipBackup) {
		const parsedPath = path.parse(inputHtmlPath);
		// Logic: /path/to/file.html -> /path/to/file.original.html
		// Logic: /path/to/README.md -> /path/to/README.original.md
		const finalBackupPath = path.join(parsedPath.dir, `${parsedPath.name}.original${parsedPath.ext}`);
		
		fs.writeFileSync(finalBackupPath, htmlContent);
		console.log(`🛡️  Backup created: ${finalBackupPath}`);
	}

	// --- Write Outputs ---
	fs.writeFileSync(inputHtmlPath, result.html);
	fs.writeFileSync(outputCssPath, result.css);

	console.log(`✅ Success!`);
	console.log(`   - Processed:    ${result.stats.elementsProcessed} elements`);
	console.log(`   - Classes:      ${result.stats.uniqueClasses} unique classes (Pattern: ${classPrefix}tag-N)`);
	console.log(`   - HTML Updated: ${inputHtmlPath}`);
	console.log(`   - CSS Created:  ${outputCssPath}`);

} catch (error) {
	console.error(`❌ Error:`);
	if (error instanceof Error) {
		console.error(error.message);
	}
	process.exit(1);
}