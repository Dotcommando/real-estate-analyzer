const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


dotenv.config();

const baseDir = __dirname;
const excludeFiles = process.env.EXCLUDE_FILES ? process.env.EXCLUDE_FILES.split(',').map(file => path.resolve(baseDir, file)) : [];

const copyDirectory = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (excludeFiles.includes(path.resolve(srcPath))) {
      continue;
    }

    entry.isDirectory() ? copyDirectory(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
  }
};

const replicateService = async () => {
  const configFiles = fs.readdirSync(baseDir)
    .filter(file => file.startsWith('data-parser.repl-') && file.endsWith('.yml'));

  for (const configFile of configFiles) {
    const instanceNumber = configFile.split('.')[1].split('-')[1];

    if (instanceNumber === '1') continue;

    const targetDir = path.join(baseDir, `../data-parser-${instanceNumber}`);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    copyDirectory(baseDir, targetDir);
  }
};

replicateService().catch(err => console.error(err));
