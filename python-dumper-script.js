import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ignore from 'ignore';
import { program } from 'commander';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCLUDED_DIRS = new Set(['.env', 'venv', '__pycache__', 'node_modules', '.git']);

async function loadGitignore(dir) {
    const ig = ignore();
    try {
        const gitignorePath = path.join(dir, '.gitignore');
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
        ig.add(gitignoreContent);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn('Error reading .gitignore:', error);
        }
    }
    return ig;
}

async function getAllFiles(dir, ig, baseDir) {
    let files = new Set();
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);
        if (ig.ignores(relativePath) || EXCLUDED_DIRS.has(entry.name)) continue;

        if (entry.isDirectory()) {
            const subFiles = await getAllFiles(fullPath, ig, baseDir);
            subFiles.forEach(file => files.add(file));
        } else if (entry.name.endsWith('.py')) {
            files.add(fullPath);
        }
    }
    return files;
}

async function getFileInfo(filePath) {
    const stats = await fs.stat(filePath);
    return {
        size: stats.size,
        modified: stats.mtime
    };
}

function calculateComplexity(content) {
    let complexity = 0;
    const ast = acorn.parse(content, { ecmaVersion: 2020, sourceType: 'module' });
    walk.simple(ast, {
        FunctionDeclaration: () => complexity++,
        ClassDeclaration: () => complexity++,
        IfStatement: () => complexity++,
        ForStatement: () => complexity++,
        WhileStatement: () => complexity++,
        TryStatement: () => complexity++
    });
    return complexity;
}

function extractImports(content) {
    const imports = [];
    const ast = acorn.parse(content, { ecmaVersion: 2020, sourceType: 'module' });
    walk.simple(ast, {
        ImportDeclaration: (node) => {
            imports.push(node.source.value);
        },
        CallExpression: (node) => {
            if (node.callee.type === 'Identifier' && node.callee.name === 'import') {
                if (node.arguments[0].type === 'Literal') {
                    imports.push(node.arguments[0].value);
                }
            }
        }
    });
    return imports;
}

async function generateFolderTree(dir, ig, depth = 0, maxDepth = Infinity) {
    let output = '';
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const fullPath = path.join(dir, entry.name);
        if (ig.ignores(path.relative(dir, fullPath))) continue;
        
        const isLast = i === entries.length - 1;
        const prefix = depth === 0 ? '' : '│   '.repeat(depth - 1) + (isLast ? '└── ' : '├── ');
        
        if (entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name)) {
            output += `${prefix}${entry.name}/\n`;
            if (depth < maxDepth) {
                output += await generateFolderTree(fullPath, ig, depth + 1, maxDepth);
            }
        } else if (entry.name.endsWith('.py')) {
            output += `${prefix}${entry.name}\n`;
        }
    }
    
    return output;
}

async function getDependencies(projectDir) {
    const reqFile = path.join(projectDir, 'requirements.txt');
    try {
        const content = await fs.readFile(reqFile, 'utf8');
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn('Error reading requirements.txt:', error);
        }
        return [];
    }
}

async function analyzeProject(projectDir, options) {
    const ig = await loadGitignore(projectDir);
    const allFiles = await getAllFiles(projectDir, ig, projectDir);
    
    let totalSize = 0;
    let totalComplexity = 0;
    let totalLoc = 0;
    const fileAnalysis = [];

    for (const file of allFiles) {
        const fileInfo = await getFileInfo(file);
        totalSize += fileInfo.size;
        
        const content = await fs.readFile(file, 'utf8');
        const complexity = calculateComplexity(content);
        totalComplexity += complexity;
        totalLoc += content.split('\n').length;
        
        const relPath = path.relative(projectDir, file);
        fileAnalysis.push({
            name: relPath,
            content: fileInfo.size > options.maxFileSize 
                ? content.slice(0, options.maxFileSize) + "\n... (file truncated due to size)"
                : content,
            imports: extractImports(content)
        });
    }

    const folderTree = await generateFolderTree(projectDir, ig, 0, options.maxDepth);
    const dependencies = await getDependencies(projectDir);

    return {
        metadata: {
            files: allFiles.size,
            size: `${(totalSize / (1024 * 1024)).toFixed(2)}MB`,
            language: "Python"
        },
        dependencies,
        metrics: {
            complexity: totalComplexity,
            loc: totalLoc
        },
        folder_structure: folderTree,
        files: fileAnalysis
    };
}

function generateOutput(analysisResult) {
    let output = "<project_analysis>\n";
    
    output += "<metadata>\n";
    for (const [key, value] of Object.entries(analysisResult.metadata)) {
        output += `<${key}>${value}</${key}>\n`;
    }
    output += "</metadata>\n\n";
    
    output += "<dependencies>\n";
    for (const dep of analysisResult.dependencies) {
        output += `<dependency>${dep}</dependency>\n`;
    }
    output += "</dependencies>\n\n";
    
    output += "<metrics>\n";
    for (const [key, value] of Object.entries(analysisResult.metrics)) {
        output += `<${key}>${value}</${key}>\n`;
    }
    output += "</metrics>\n\n";
    
    output += "<folder_structure>\n";
    output += analysisResult.folder_structure;
    output += "</folder_structure>\n\n";
    
    for (const file of analysisResult.files) {
        output += `<file name="${file.name}">\n`;
        output += "<imports>\n";
        for (const imp of file.imports) {
            output += `<import>${imp}</import>\n`;
        }
        output += "</imports>\n";
        output += "<content>\n";
        output += "```python\n" + file.content + "\n```\n";
        output += "</content>\n";
        output += "</file>\n\n";
    }
    
    output += "</project_analysis>";
    return output;
}

async function main() {
    program
        .option('-d, --max-depth <number>', 'Maximum depth for folder tree', parseInt, 3)
        .option('-o, --output <filename>', 'Output file name', 'analysis_output.txt')
        .option('-s, --max-file-size <number>', 'Maximum file size in bytes', parseInt, 1024 * 1024)
        .option('-p, --preview-lines <number>', 'Number of preview lines for large files', parseInt, 10)
        .argument('<project-dir>', 'Path to the Python project to analyze')
        .parse(process.argv);

    const options = program.opts();
    const projectDir = program.args[0];

    try {
        const analysisResult = await analyzeProject(projectDir, options);
        const output = generateOutput(analysisResult);
        
        await fs.writeFile(options.output, output);
        
        console.log(`Analysis complete. Output written to ${options.output}`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
