# Python Project Dumper (Node.js version)

This tool works in a Python project folder, collects relevant code and context, then dumps it into a txt file. This is useful for providing to an LLM.

## Prerequisites

1. Make sure you have Node.js installed on your Mac. If not, download and install it from https://nodejs.org/

2. You'll need Git to clone the repository. If you don't have Git, install it from https://git-scm.com/download/mac

## Installation

1. Open Terminal on your Mac.

2. Clone the repository:
   ```
   git clone https://github.com/your-username/python-project-dumper.git
   ```

3. Navigate to the project directory:
   ```
   cd python-project-dumper
   ```

4. Install dependencies:
   ```
   npm install
   ```

## Usage

There are three ways to use this tool:

### 1. Command Line Method

Run the dumper with the following command in Terminal:

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

### 2. Run as a Shell Script

1. Make the run_dumper.command file executable:
   ```
   chmod +x run_dumper.command
   ```

2. Double-click the `run_dumper.command` file in Finder.

3. When prompted, enter the full path to the Python project you want to analyze.

### 3. macOS Application Bundle (Recommended for easy distribution and use)

To create a macOS Application Bundle, we've provided an automation script:

1. Make the build script executable:
   ```
   chmod +x build_mac_bundle.sh
   ```

2. Run the build script:
   ```
   ./build_mac_bundle.sh
   ```

This script will:
- Install pkg if it's not already installed
- Package your Node.js script
- Create the Application Bundle structure
- Move the packaged executable to the correct location
- Create the necessary shell script
- Copy the Info.plist file to the correct location

After running the script, you'll have a PythonProjectDumper.app that can be distributed and used on macOS. Users can double-click the app to run it, and it will prompt for the path to the Python project to analyze.

Note: The script doesn't create an icon file. If you want to add an icon, create an icon.icns file and place it in PythonProjectDumper.app/Contents/Resources/.

## Output

The analysis result will be saved in the specified output file (default: analysis_output.txt) in the current directory.

## Troubleshooting

If you encounter any issues:

1. Ensure Node.js is correctly installed. Check by running `node --version` in Terminal.
2. Make sure you're in the correct directory when running the commands.
3. If you get a "module not found" error, try running `npm install` again.
4. If the Application Bundle doesn't work, ensure all files are in the correct locations within the .app structure.

For further assistance, please open an issue on the GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
