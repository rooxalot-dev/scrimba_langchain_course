import { readFile } from 'fs/promises';
import { resolve } from 'path';

const init = async () => {
  const filePath = resolve(__dirname, '..', 'resources', 'scrimba-info.txt');

  try {
    const resultText = await readFile(filePath, { encoding: 'utf8' });
    console.log('Original Text', resultText);
  } catch (error) {
    console.log('Error', error);
  }
};

init();
