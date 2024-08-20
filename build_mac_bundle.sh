#!/bin/bash

# Exit on any error
set -e

# Check if pkg is installed
if ! command -v pkg &> /dev/null
then
    echo "pkg is not installed. Installing pkg..."
    npm install -g pkg
fi

# Package the Node.js script
echo "Packaging Node.js script..."
pkg python-dumper-script.js --targets node16-macos-x64 --output python-project-dumper --public-packages "*" --options experimental-modules --input-type=module --debug

# Create the Application Bundle structure
echo "Creating Application Bundle structure..."
mkdir -p PythonProjectDumper.app/Contents/MacOS
mkdir -p PythonProjectDumper.app/Contents/Resources

# Move the packaged executable
echo "Moving packaged executable..."
mv python-project-dumper PythonProjectDumper.app/Contents/MacOS/

# Create the shell script
echo "Creating shell script..."
cat << EOF > PythonProjectDumper.app/Contents/MacOS/PythonProjectDumper
#!/bin/bash
cd "\$(dirname "\$0")"
./python-project-dumper "\$@"
EOF

# Make the shell script executable
chmod +x PythonProjectDumper.app/Contents/MacOS/PythonProjectDumper

# Copy Info.plist
echo "Copying Info.plist..."
cp Info.plist PythonProjectDumper.app/Contents/

echo "Application Bundle created successfully!"
echo "Note: You may want to add an icon.icns file to PythonProjectDumper.app/Contents/Resources/"