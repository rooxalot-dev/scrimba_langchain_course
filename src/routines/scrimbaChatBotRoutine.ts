import { config } from 'dotenv';

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { loadVectorstore } from '../utils/loadVectorStore';
import { createSupabaseVectorStore } from './../utils/supabaseVectorStoreFactory';
import { DocumentContentOutputParser } from '../utils/DocumentContentOutputParser';

export const initScrimbaChatbotRoutine = async () => {
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

  const question = `How can I access Scrimba for? Does it requires me to install anything on my computer, because I don't have have enough space in it...`;
  console.log('Question => ', question);

  const standaloneQuestionVectorChain = standaloneChatPromptTemplate
    .pipe(openAIChatModel)
    .pipe(new StringOutputParser())
    .pipe(supabaseRetriever)
    .pipe(DocumentContentOutputParser.parse);

  const askQuestionChain = chatPromptTemplate
    .pipe(openAIChatModel)
    .pipe(new StringOutputParser());

  const sequenceChain = RunnableSequence.from([
    {
      originalQuestion: new RunnablePassthrough(),
      context: standaloneQuestionVectorChain,
    },
    {
      context: (prevResonse) => prevResonse.context,
      question: ({ originalQuestion }) => originalQuestion.question,
    },
    askQuestionChain,
  ]);

  const response = await sequenceChain.invoke({ question });

  console.log('Answers =>', response);
};
