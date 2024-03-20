import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

import { loadVectorstore } from './loadVectorStore';
import { createSupabaseVectorStore } from './lib/supabaseVectorStoreFactory';

const init = async () => {
  // Loads the vectorstore
  const shouldLoadVectorstore = (process.env.LOAD_VECTORSTORE || 'false').toLowerCase() === 'true';
  if (shouldLoadVectorstore) loadVectorstore();

  const openAIApiKey = process.env.OPENAI_API_KEY || '';
  const openAIChatModel = new ChatOpenAI({ openAIApiKey });
  const chatPromptTemplate = ChatPromptTemplate.fromTemplate(`
    Based on the user's question below, turn it in a standalone question.
    Don't explain anything, just return the standalone question.
    User's question: {question}
  `);
  const standaloneQuestionChain = chatPromptTemplate.pipe(openAIChatModel);
  const questionAnswer = await standaloneQuestionChain.invoke({
    question: 'What is a scrim? I have no idea since I am new at programming and could not find anything on the dictionary.'
  });
  const standaloneQuestion = questionAnswer.content as string;

  console.log('standaloneQuestion =>', standaloneQuestion);

  const supabaseVectorStore = createSupabaseVectorStore();
  /**
   * Below is a quick example of how we can use Supabase as a similarity search tool, already taking
   * into concerm the semantic meaning of the words, thorugh the vectors values.
   *
   * const foundVectors = await supabaseVectorStore.similaritySearchWithScore(standaloneQuestion);
   * console.log('foundVectors', foundVectors);
   */
};

config();
init();
