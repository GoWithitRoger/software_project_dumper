#!/bin/bash

# Change to the directory containing this script
cd "$(dirname "$0")"

# Prompt the user for the path to the Python project
echo "Enter the path to the Python project you want to analyze:"
read project_path

# Run the Node.js script
node python-dumper-script.js "$project_path"

# Keep the terminal window open until the user presses Enter
echo "Analysis complete. Press Enter to close this window."
read
