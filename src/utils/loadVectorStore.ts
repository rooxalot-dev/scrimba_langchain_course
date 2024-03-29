import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { createSupabaseVectorStore } from './supabaseVectorStoreFactory';

export const loadVectorstore = async () => {
  const filePath = resolve(__dirname, '..', 'resources', 'scrimba-info.txt');

  try {
    const resultText = await readFile(filePath, { encoding: 'utf8' });

    const chunkSize = 500;
    const chunkOverlapSize = chunkSize * 0.10;
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap: chunkOverlapSize, // Configure how many characters from one chunk should appear in another (default: 200)

    });
    const documentsOutput = await textSplitter.createDocuments([resultText]);
    const supabaseVectorStore = createSupabaseVectorStore();
    await supabaseVectorStore.addDocuments(documentsOutput)

    console.log('Supabase vectorstore loaded!');
  } catch (error) {
    console.log('Error', error);
  }
};
