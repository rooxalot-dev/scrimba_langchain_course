import { resolve } from 'path';
import { readFile } from 'fs/promises';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const init = async () => {
  const filePath = resolve(__dirname, '..', 'resources', 'scrimba-info.txt');

  try {
    const resultText = await readFile(filePath, { encoding: 'utf8' });
    console.log('Original Text', resultText.length);

    const textSplitter = new RecursiveCharacterTextSplitter();
    const documentsOutput = await textSplitter.createDocuments([resultText]);
    console.log('Documents Text Output', documentsOutput);
  } catch (error) {
    console.log('Error', error);
  }
};

init();
