#! bin/node

const fs = require('fs');
const path = require('path');
const flat = require('flat');

// Function to determine if a file is text or binary
/**
 * Determines if a file is text or binary.
 * @param {string} filePath - Path of the file to check.
 * @returns {boolean} True if the file is text, false if binary.
 */
const isTextFile = (filePath) => {
  const textFileExtensions = [
    '.txt', '.md', '.json', '.js',
    '.html', '.css', '.scss', '.sass',
    '.jsx', '.mjs', '.mjsx', '.sh',
    '.xml', '.svg'
  ]; // Add more extensions if needed
  return textFileExtensions.includes(path.extname(filePath).toLowerCase());
};

// Function to read directory and files recursively
/**
 * Reads the directory and returns a JSON object representing the structure and contents.
 * @param {string} dirPath - Path of the directory to read.
 * @returns {Object} JSON object representing the directory structure and contents.
 */
const readDirectory = (dirPath) => {
  const result = {};
  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      result[item] = readDirectory(fullPath);
    } else {
      if (isTextFile(fullPath)) {
        result[item] = fs.readFileSync(fullPath, 'utf-8');
      } else {
        result[item] = '[[binaryFile]]';
      }
    }
  });

  return result;
};

// Main function
const main = async () => {
  try {
    const dirPath = path.join(process.cwd(), 'src');
    const result = readDirectory(dirPath);

    const filesPath = Object.keys(flat(result, { delimiter: '/' }));
    fs.writeFileSync('helpers/files.json', JSON.stringify(filesPath, null, 2), 'utf-8');
    fs.writeFileSync('helpers/structure.json', JSON.stringify(result), 'utf-8');
    return 'helpers IA created successfully!';
  } catch (error) {
    throw new Error('Error reading directory or writing JSON file');
  }
};

main()
  .then((res) => {
    console.log(res);
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(err.code || 1);
  });
