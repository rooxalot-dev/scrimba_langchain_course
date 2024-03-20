import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { loadVectorstore } from './loadVectorStore';
import { createSupabaseVectorStore } from './lib/supabaseVectorStoreFactory';

const init = async () => {
  // Loads the vectorstore
  const shouldLoadVectorstore = (process.env.LOAD_VECTORSTORE || 'false').toLowerCase() === 'true';
  if (shouldLoadVectorstore) loadVectorstore();

  const supabaseVectorStore = createSupabaseVectorStore();
  const supabaseRetriever = supabaseVectorStore.asRetriever();

  const openAIApiKey = process.env.OPENAI_API_KEY || '';
  const openAIChatModel = new ChatOpenAI({ openAIApiKey });
  const standaloneChatPromptTemplate = ChatPromptTemplate.fromTemplate(`
    Based on the user's question below, turn it in a standalone question.
    Don't explain anything, just return the standalone question.
    User's question: {question}
  `);

  const standaloneQuestionRetrieveChain = standaloneChatPromptTemplate
    .pipe(openAIChatModel)
    .pipe(new StringOutputParser())
    .pipe(supabaseRetriever);
  const standaloneQuestionRetrieveChainAnswer = await standaloneQuestionRetrieveChain.invoke({
    question: 'What is a scrim? I have no idea since I am new at programming and could not find anything on the dictionary.'
  });

  console.log('standaloneQuestionRetrieveChainAnswer =>', standaloneQuestionRetrieveChainAnswer);
};

config();
init();
