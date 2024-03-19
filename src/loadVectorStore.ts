import { resolve } from 'path';
import { readFile } from 'fs/promises';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const loadVectorstore = async () => {
  const filePath = resolve(__dirname, '..', 'resources', 'scrimba-info.txt');

  try {
    const resultText = await readFile(filePath, { encoding: 'utf8' });

    const chunkSize = 500;
    const chunkOverlapSize = chunkSize * 0.10;
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: chunkOverlapSize, // Configure how many characters from one chunk should appear in another (default: 200)

    });
    const documentsOutput = await textSplitter.createDocuments([resultText]);

    const openAIApiKey = process.env.OPENAI_API_KEY || '';
    const openAIEmbeddingsAlgorithm = new OpenAIEmbeddings({ openAIApiKey });

    const supabaseUrl = process.env.SUPABASE_API_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    const supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);

    await SupabaseVectorStore.fromDocuments(
      documentsOutput,
      openAIEmbeddingsAlgorithm,
      {
        client: supabaseClient,
        tableName: 'documents', // When we first configure supabase with Langchain, we created a table called "documents"
      }
    );

    console.log('Supabase vectorstore loaded!');
  } catch (error) {
    console.log('Error', error);
  }
};
