import * as cheerio from 'cheerio';

export interface ExtractionOptions {
	/** Prefix for generated class names. Default: 'eis-' */
	classPrefix?: string;
	/** If provided, injects a <link> tag pointing to this path into the HTML head */
	injectCssPath?: string;
}

export interface ExtractionResult {
	/** The cleaned HTML string with classes added and style attributes removed */
	html: string;
	/** The generated CSS string */
	css: string;
	stats: {
		elementsProcessed: number;
		uniqueClasses: number;
	};
}

/**
 * Parses HTML string, moves inline styles to CSS, and returns the new content.
 * Does NOT write to disk.
 */
export function extract(htmlContent: string, options: ExtractionOptions = {}): ExtractionResult {
	const { classPrefix = 'eis-', injectCssPath } = options;
	
	// FIX: Removed 'decodeEntities' as it is not in CheerioOptions anymore.
	// xmlMode: false ensures standard HTML parsing.
	const $ = cheerio.load(htmlContent, { 
		xmlMode: false
	});

	const styleMap = new Map<string, string>();
	let classCounter = 1;
	let processedCount = 0;

	// Iterate over every element with a style attribute
	$('[style]').each((_, element) => {
		const el = $(element);
		let styleString = el.attr('style') || '';
		
		// Normalize: trim whitespace and trailing semicolons
		styleString = styleString.trim();
		if (styleString.endsWith(';')) {
			styleString = styleString.slice(0, -1);
		}

		if (!styleString) return;

		processedCount++;

		// Deduplicate: Check if this exact style string exists in our map
		let className = styleMap.get(styleString);
		if (!className) {
			// NAMING LOGIC: eis-tagName-counter (e.g., eis-div-1)
			// Clean the tag name to ensure it's valid css class safe
			const tagName = element.tagName.toLowerCase().replace(/[^a-z0-9]/g, '');
			className = `${classPrefix}${tagName}-${classCounter++}`;
			styleMap.set(styleString, className);
		}

		// Apply changes
		el.addClass(className);
		el.removeAttr('style');
	});

	// Inject CSS Link if requested
	if (injectCssPath) {
		const linkTag = `<link rel="stylesheet" href="${injectCssPath}">`;
		if ($('head').length > 0) {
			$('head').append(`\n    ${linkTag}`);
		} else {
			// If no head exists, prepend to the root so the browser handles it
			$.root().prepend(linkTag);
		}
	}

	// Generate CSS content
	const cssLines: string[] = [];
	for (const [style, className] of styleMap.entries()) {
		cssLines.push(`.${className} { ${style}; }`);
	}

	return {
		html: $.html(),
		css: cssLines.join('\n'),
		stats: {
			elementsProcessed: processedCount,
			uniqueClasses: styleMap.size
		}
	};
}