import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use fs to read the file on the server side
  const filePath = path.join(process.cwd(), 'data/words-58k.txt'); // Adjust the path to your file

  try {
    // Read the file content asynchronously
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Send the response with the file content
    res.status(200).json({ content: fileContent });
  } catch (error) {
    console.error('Error reading file:', error);

    // If an error occurs, send a 500 status with the error message
    res.status(500).json({ error: 'Failed to read the file' });
  }
}