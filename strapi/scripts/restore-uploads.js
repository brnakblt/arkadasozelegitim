'use strict';

const fs = require('fs-extra');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mime = require('mime-types');

async function restoreUploads() {
  const uploadsDir = path.join(__dirname, '../public/uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('Uploads directory not found.');
    return;
  }

  const files = fs.readdirSync(uploadsDir).filter(file => {
    return fs.statSync(path.join(uploadsDir, file)).isFile() && file !== '.gitkeep';
  });

  console.log(`Found ${files.length} files in public/uploads.`);

  for (const fileName of files) {
    await processFile(fileName, uploadsDir);
  }
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
}

function getFileData(fileName, uploadsDir) {
  const filePath = path.join(uploadsDir, fileName);
  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split('.').pop();
  const mimeType = mime.lookup(ext || '') || '';

  return {
    path: filePath,
    name: fileName,
    size,
    type: mimeType,
  };
}

async function processFile(fileName, uploadsDir) {
  // Check if file already exists in DB
  const existingFile = await strapi.query('plugin::upload.file').findOne({
    where: {
      name: fileName,
    },
  });

  if (existingFile) {
    console.log(`File ${fileName} already exists in DB.`);
    return;
  }

  console.log(`Restoring ${fileName}...`);

  const fileData = getFileData(fileName, uploadsDir);

  try {
    await strapi.plugin('upload').service('upload').upload({
      files: {
        path: fileData.path,
        name: fileData.name,
        type: fileData.type,
        size: fileData.size,
      },
      data: {
        fileInfo: {
          alternativeText: fileName,
          caption: fileName,
          name: fileName,
        },
      },
    });
    console.log(`Successfully restored ${fileName}`);
  } catch (error) {
    console.error(`Failed to restore ${fileName}:`, error);
  }
}

async function main() {
  const Strapi = require('@strapi/strapi');

  const app = await Strapi({
    appDir: path.resolve(__dirname, '..'),
    distDir: path.resolve(__dirname, '../dist'),
  }).load();

  app.log.level = 'error';

  await restoreUploads();
  
  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
