import { config } from 'dotenv';
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import { supabaseClient } from "./supabaseClient";

export const createSupabaseVectorStore = () => {
  config();

  const openAIApiKey = process.env.OPENAI_API_KEY || '';
  const openAIEmbeddingsAlgorithm = new OpenAIEmbeddings({ openAIApiKey });

  const supabaseVectorStore = new SupabaseVectorStore(
    openAIEmbeddingsAlgorithm,
    {
      client: supabaseClient,
      tableName: 'documents', // When we first configure supabase with Langchain, we created a table called "documents"
      queryName: 'match_documents', // When we first configure supabase with Langchain, we created a db function called "match_documents"
    }
  );

  return supabaseVectorStore;
};
