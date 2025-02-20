import * as fs from 'fs/promises';
import * as path from 'path';

const API_DOCS_DIR = path.join(__dirname, '..', 'docs', 'api');
const OUTPUT_FILE = path.join(__dirname, '..', 'docs', 'api.md');

interface DocFile {
    path: string;
    content: string;
}

async function combineApiDocs() {
    try {
        // Get all markdown files
        const files = await getAllMarkdownFiles(API_DOCS_DIR);
        
        // Read and process each file
        const docs = await Promise.all(
            files.map(async (file): Promise<DocFile> => ({
                path: file,
                content: await fs.readFile(file, 'utf8')
            }))
        );

        // Process content
        const processedDocs = docs.map(doc => ({
            ...doc,
            content: processContent(doc.content)
        }));

        // Combine all content
        const combined = [
            '# ChainCraft Engine API Reference\n\n',
            ...processedDocs.map(doc => doc.content)
        ].join('\n\n');

        // Write combined file
        await fs.writeFile(OUTPUT_FILE, combined);
        
        console.log('API documentation combined successfully');
    } catch (error) {
        console.error('Error combining API docs:', error);
    }
}

async function getAllMarkdownFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(entry => {
            const res = path.resolve(dir, entry.name);
            return entry.isDirectory() ? getAllMarkdownFiles(res) : res;
        })
    );
    return files
        .flat()
        .filter(file => file.endsWith('.md'))
        .filter(file => !file.endsWith('README.md'));
}

function processContent(content: string): string {
    return content
        // Remove navigation sections
        .replace(/^#{1,2} Navigation.*?\n\n/gms, '')
        // Remove internal links but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove horizontal rules
        .replace(/^\*\*\*\s*$/gm, '')
        // Remove empty lines at start/end
        .trim();
}

// Run the script
combineApiDocs();