#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
FILE="$SCRIPT_DIR/build/index.js"
MAX_SIZE_20_KB_IN_BYTES=20480

# Check if the file exists first
if [ ! -f "$FILE" ]; then
    echo "Error: File $FILE does not exist."
    exit 1
fi

# Get file size in bytes
# (Works on both Linux and macOS/BSD)
if [[ "$OSTYPE" == "darwin"* ]]; then
    FILE_SIZE=$(stat -f%z "$FILE")
else
    FILE_SIZE=$(stat -c%s "$FILE")
fi

# Compare sizes
if [ "$FILE_SIZE" -gt "$MAX_SIZE_20_KB_IN_BYTES" ]; then
    echo "Error: File size ($FILE_SIZE bytes) exceeds the maximum allowed limit ($MAX_SIZE_20_KB_IN_BYTES bytes)."
    exit 1
fi

echo "File size is acceptable ($FILE_SIZE bytes)."
