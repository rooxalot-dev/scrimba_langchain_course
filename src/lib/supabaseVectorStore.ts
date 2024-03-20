import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import { supabaseClient } from "./../lib/supabaseClient";

export const supabaseVectorStore = async () => {
  const openAIApiKey = process.env.OPENAI_API_KEY || '';
  const openAIEmbeddingsAlgorithm = new OpenAIEmbeddings({ openAIApiKey });

  const supabaseVectorStore = new SupabaseVectorStore(
    openAIEmbeddingsAlgorithm,
    {
      client: supabaseClient,
      tableName: 'documents', // When we first configure supabase with Langchain, we created a table called "documents"
    }
  );

  return supabaseVectorStore;
};
