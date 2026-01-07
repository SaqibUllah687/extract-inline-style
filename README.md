# extract-inline-style

**Extract inline `style="..."` attributes from HTML elements, deduplicate them, and move them to an external CSS file.**

<p>
  <a href="https://www.npmjs.com/package/extract-inline-style"><img src="https://img.shields.io/npm/v/extract-inline-style.svg?style=flat-square&color=d25353" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/extract-inline-style"><img src="https://img.shields.io/bundlephobia/minzip/extract-inline-style?style=flat-square&color=38bd24" alt="size"></a>
  <a href="https://www.npmjs.com/package/extract-inline-style"><img src="https://img.shields.io/npm/dt/extract-inline-style.svg?style=flat-square&color=38bd24" alt="npm downloads"></a>
  <a href="https://github.com/mgks/extract-inline-style/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mgks/extract-inline-style.svg?style=flat-square&color=blue" alt="license"></a>
</p>

## Features

*   **Automated Extraction:** Instantly rips `style="..."` attributes from HTML elements and moves them to an external CSS file.
*   **Smart Compression:** Deduplicates identical styles automatically. (e.g., 50 `<div>`s with the same style become 1 single CSS class).
*   **Semantic Naming:** Generates readable class names based on the tag (e.g., `eis-div-1`, `eis-span-2`) instead of random hashes.
*   **Auto-Injection:** Automatically appends the correct `<link rel="stylesheet">` tag to your HTML head.
*   **Safety First:** Creates an automatic backup (`.original.html`) before modifying your files, so you never lose data.
*   **API & CLI:** Use it as a command-line tool for quick fixes or import the API for build pipelines.

## Installation

```bash
npm install extract-inline-style
```

## Usage

### CLI

```bash
# Auto-generate CSS filename (index-extracted.css)
$ npx extract-inline-style index.html

# Specify output CSS filename
$ npx extract-inline-style index.html my-styles.css
```

#### CLI Options

| Flag | Alias | Description | Default |
| :--- | :--- | :--- | :--- |
| `--prefix` | `-p` | Custom prefix for generated classes. | `eis-` |
| `--no-backup` | | Skip creating the `.original.html` backup file. | `false` |
| `--no-inject` | | Do not add `<link>` tag to HTML head. | `false` |
| `--version` | `-v` | Show version number. | |
| `--help` | `-h` | Show help usage. | |

## API

Perfect for build tools, static site generators, or content pipelines. The API operates on strings and returns strings (it does not write to disk).

```ts
import { extract } from 'extract-inline-style';

const html = `
  <h1 style="color: blue">Hello</h1>
  <p style="color: blue">World</p>
`;

// Run extraction
const result = extract(html, { 
  classPrefix: 'theme-',
  injectCssPath: './styles.css' 
});

console.log(result.html);
// <head><link rel="stylesheet" href="./styles.css"></head>
// ...
// <h1 class="theme-h1-1">Hello</h1>
// <p class="theme-p-2">World</p>

console.log(result.css);
// .theme-h1-1 { color: blue; }
// .theme-p-2 { color: blue; }
```

#### API Options

The `extract(html, options)` function accepts an optional configuration object:

| Option | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `classPrefix` | `string` | Prefix for generated CSS classes. | `'eis-'` |
| `injectCssPath` | `string` | If provided, injects a `<link rel="stylesheet">` tag pointing to this path. | `undefined` |

#### Return Value

The function returns an object containing:

```ts
{
  html: string;  // The cleaned HTML string
  css: string;   // The generated CSS string
  stats: {
    elementsProcessed: number; // How many inline styles were found
    uniqueClasses: number;     // How many unique classes were generated
  }
}
```

## License

MIT

> **{ github.com/mgks }**
> 
> ![Website Badge](https://img.shields.io/badge/Visit-mgks.dev-blue?style=flat&link=https%3A%2F%2Fmgks.dev) ![Sponsor Badge](https://img.shields.io/badge/%20%20Become%20a%20Sponsor%20%20-red?style=flat&logo=github&link=https%3A%2F%2Fgithub.com%2Fsponsors%2Fmgks)
