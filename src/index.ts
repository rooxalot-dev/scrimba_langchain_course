import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { loadVectorstore } from './loadVectorStore';
import { createSupabaseVectorStore } from './lib/supabaseVectorStoreFactory';
import { DocumentContentOutputParser } from './custom/DocumentContentOutputParser';

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

  const chatPromptTemplate = ChatPromptTemplate.fromTemplate(`
    Based on the context below and the user's question, return a friendly answer.
    Only give answers based on the informed context, don't make anything up.
    In case you don't know the answer for the question, please apologise and advise the user to send an email to "help@scrimba.com"

    {context}

    User's question: {question}
  `);

  const question = `What programming languages I can learn in here? I'm really new at this and I'm not sure I can follow...`;

  const standaloneQuestionVectorChain = standaloneChatPromptTemplate
    .pipe(openAIChatModel)
    .pipe(new StringOutputParser())
    .pipe(supabaseRetriever)
    .pipe(DocumentContentOutputParser.parse);

  const standaloneQuestionVectorChainAnswer = await standaloneQuestionVectorChain.invoke({ question });

  const askQuestionChain = chatPromptTemplate
    .pipe(openAIChatModel)
    .pipe(new StringOutputParser());

  const usersQuestionChain = await askQuestionChain.invoke({
      context: standaloneQuestionVectorChainAnswer.join('\\n'),
      question,
    })

  console.log('answers =>', {
    standaloneQuestionVectorChainAnswer,
    usersQuestionChain,
  });
};

config();
init();
