# extract-inline-style

**Turn spaghetti code into clean code instantly. Extracts inline `style="..."` attributes, deduplicates them into atomic classes, and cleans your HTML.**

[![npm version](https://img.shields.io/npm/v/extract-inline-style.svg?style=flat-square&color=d25353)](https://www.npmjs.com/package/extract-inline-style)
[![npm downloads](https://img.shields.io/npm/dt/extract-inline-style.svg?style=flat-square&color=38bd24)](https://www.npmjs.com/package/extract-inline-style?activeTab=versions)
[![npm version](https://img.shields.io/github/license/mgks/extract-inline-style.svg?style=flat-square&color=blue)](https://github.com/mgks/extract-inline-style/blob/main/LICENSE)

<img width="720" src="https://github.com/mgks/extract-inline-style/blob/main/preview.gif?raw=true">

**Pain Point:**
You have a legacy HTML file, an email template, or scraped content. It looks like this:
```html
<div style="font-size: 14px; color: #fff; margin-bottom: 10px;">Hello</div>
<div style="font-size: 14px; color: #333; margin-bottom: 10px;">World</div>
<div style="font-size: 14px; color: #555; margin-bottom: 10px;">!</div>
```
It's unreadable. It's bloated. It's impossible to maintain.

**The Solution:**
Run `npx extract-inline-style index.html`. The tool analyzes your code and:

1.  **Surgically Removes** the inline styles.
2.  **Deduplicates** them (Compression). It sees those 3 divs are identical.
3.  **Generates** a single, semantic class.
4.  **Injects** the stylesheet link automatically.
5.  **Backs up** your original file (just in case).

**The Result:**
```html
<head>
  <link rel="stylesheet" href="./index-extracted.css">
</head>
<body>
  <div class="eis-div-1">Hello</div>
  <div class="eis-div-1">World</div>
  <div class="eis-div-1">!</div>
</body>
```
*Your file size just dropped, and your sanity just increased.*

## Features

*   **Universal Parser:** Works on HTML files, fragments, and even HTML embedded in Markdown.
*   **Smart Compression:** 1,000 elements with the same style = **1 CSS Class**.
*   **Semantic Naming:** Classes are named by tag (e.g., `eis-button-1`, `eis-span-2`) for easy debugging.
*   **Safety First:** Automatic `.original.html` backups. Never lose data.
*   **API Ready:** Perfect for content pipelines and static site generators.

## Installation

```bash
npm install extract-inline-style
```

## Usage

### CLI

```bash
# Auto-generate CSS filename (index-extracted.css)
npx extract-inline-style index.html

# Specify output CSS filename
npx extract-inline-style index.html my-styles.css
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