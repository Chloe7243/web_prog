import { log } from 'console';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function readFile(req, webRoot) {
  try {
    let requestPath = req.url;
    if (requestPath === '/') requestPath = '/index.html';
    const filePath = path.join(webRoot, requestPath);
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    return false;
  }
}
