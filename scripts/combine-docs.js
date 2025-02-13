import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_DOCS_DIR = path.join(__dirname, '..', 'docs', 'api');
const OUTPUT_FILE = path.join(__dirname, '..', 'docs', 'api.md');

async function combineApiDocs() {
    try {
        const files = await getAllMarkdownFiles(API_DOCS_DIR);
        const docs = await Promise.all(
            files.map(async (file) => ({
                path: file,
                content: await fs.readFile(file, 'utf8')
            }))
        );

        const processedDocs = docs.map(doc => ({
            ...doc,
            content: processContent(doc.content)
        }));

        const combined = [
            '# ChainCraft Engine API Reference\n\n',
            ...processedDocs.map(doc => doc.content)
        ].join('\n\n');

        await fs.writeFile(OUTPUT_FILE, combined);
        console.log('API documentation combined successfully');
    } catch (error) {
        console.error('Error combining API docs:', error);
    }
}

async function getAllMarkdownFiles(dir) {
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

function processContent(content) {
    return content
        .replace(/^#{1,2} Navigation.*?\n\n/gms, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\*\*\*\s*$/gm, '')
        .trim();
}

combineApiDocs();