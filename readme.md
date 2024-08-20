# Python Project Analyzer (Node.js version)

This tool works in a Python project folder and collects relevant code and context, then dumps it into a txt file. This is useful for providing to an LLM.

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
node python-dumper-script.js <path-to-python-project>
```

Replace `<path-to-python-project>` with the path to the Python project you want to analyze.

#### Options

- `-d, --max-depth <number>`: Maximum depth for folder tree (default: 3)
- `-o, --output <filename>`: Output file name (default: analysis_output.txt)
- `-s, --max-file-size <number>`: Maximum file size in bytes (default: 1048576)
- `-p, --preview-lines <number>`: Number of preview lines for large files (default: 10)

Example with options:

```
node python-dumper-script.js /path/to/your/python/project -d 5 -o my_analysis.txt -s 2097152 -p 20
```

... (rest of the README remains the same)
