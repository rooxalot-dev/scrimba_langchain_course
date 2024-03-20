import { config } from 'dotenv';
import { loadVectorstore } from './loadVectorStore';

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

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
    question: 'What\'s the name of tool used to tighten bolts? I need to fix a few things in my house and it would be best to have everything in place before starting.'
  });

  console.log('questionAnswer -> ', questionAnswer.content);
};

config();
init();
