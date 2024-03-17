import { resolve } from 'path';
import { readFile } from 'fs/promises';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const init = async () => {
  const filePath = resolve(__dirname, '..', 'resources', 'scrimba-info.txt');

  try {
    const resultText = await readFile(filePath, { encoding: 'utf8' });
    console.log('Original Text', resultText.length);

    const chunkSize = 500;
    const chunkOverlapSize = chunkSize * 0.10;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: chunkOverlapSize, // Configure how many characters from one chunk should appear in another (default: 200)

    });
    const documentsOutput = await textSplitter.createDocuments([resultText]);
    console.log('Documents Text Output', documentsOutput.length);
  } catch (error) {
    console.log('Error', error);
  }
};

init();
