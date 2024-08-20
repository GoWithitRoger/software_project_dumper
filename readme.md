# Python Project Analyzer (Node.js version)

This tool works in a Python (for now) project folder and collects reelvant code and context, then dumps it into a txt file. This is useful for providing to an LLM.

## Prerequisites

1. Make sure you have Node.js installed on your Mac. If not, download and install it from https://nodejs.org/

2. You'll need Git to clone the repository. If you don't have Git, install it from https://git-scm.com/download/mac

## Installation

1. Open Terminal on your Mac.

2. Clone the repository:
   ```
   git clone https://github.com/your-username/python-project-analyzer.git
   ```

3. Navigate to the project directory:
   ```
   cd python-project-analyzer
   ```

4. Install dependencies:
   ```
   npm install
   ```

5. Make the launcher script executable:
   ```
   chmod +x run_analyzer.command
   ```

## Usage

There are two ways to run the analyzer:

### 1. Double-click Method (Easiest)

1. In Finder, navigate to the `python-project-analyzer` folder.
2. Double-click the `run_analyzer.command` file.
3. When prompted, enter the full path to the Python project you want to analyze.
4. The analysis will run, and the results will be saved in the `analysis_output.txt` file in the same directory.

### 2. Command Line Method (For Advanced Options)

Run the analyzer with the following command in Terminal:

```
node project-analyzer.js <path-to-python-project>
```

Replace `<path-to-python-project>` with the path to the Python project you want to analyze.

#### Options

- `-d, --max-depth <number>`: Maximum depth for folder tree (default: 3)
- `-o, --output <filename>`: Output file name (default: analysis_output.txt)
- `-s, --max-file-size <number>`: Maximum file size in bytes (default: 1048576)
- `-p, --preview-lines <number>`: Number of preview lines for large files (default: 10)

Example with options:

```
node project-analyzer.js /path/to/your/python/project -d 5 -o my_analysis.txt -s 2097152 -p 20
```

## Output

The analysis result will be saved in the specified output file (default: analysis_output.txt) in the current directory.

## Troubleshooting

If you encounter any issues:

1. Ensure Node.js is correctly installed. Check by running `node --version` in Terminal.
2. Make sure you're in the correct directory when running the commands.
3. If you get a "module not found" error, try running `npm install` again.
4. If the double-click method doesn't work, ensure the `run_analyzer.command` file is executable.

For further assistance, please open an issue on the GitHub repository.
