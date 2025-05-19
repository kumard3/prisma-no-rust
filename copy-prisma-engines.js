import fs from 'fs';
import path from 'path';

// Define source and destination paths
const source = path.join(process.cwd(), 'generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node');
const destination = path.join(process.cwd(), '.next/server/chunks/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node');

// Create destination directory if it doesn't exist
const destDir = path.dirname(destination);
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created directory: ${destDir}`);
}

// Copy the file
try {
    fs.copyFileSync(source, destination);
    console.log(`Successfully copied Prisma engine to: ${destination}`);
} catch (error) {
    console.error('Error copying Prisma engine:', error);
} 