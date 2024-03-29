import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';

export const initRunnableSequenceDemoRoutine = async () => {
  // It reads the openai api key from .env automatically.
  const openAIChatModel = new ChatOpenAI();

  const fixPunctuationTemplate = PromptTemplate.fromTemplate(`
    Given a sentence, add punctuation when needed.
    sentence: {sentence}
    sentence with punctuation:
  `);
  const fixGrammarTemplate = PromptTemplate.fromTemplate(`
    Given a sentence, correct its grammar.
    sentence: {punctuated_sentence}
    sentence with correct grammar:
  `);
  const translationTemplate = PromptTemplate.fromTemplate(`
    Given a sentence, translate it to the desired language.
    sentence: {grammatically_correct_sentence}
    language: {language}
    translated sentence:
  `);

  const fixPunctuationRunnableSequenceChain = RunnableSequence.from([fixPunctuationTemplate, openAIChatModel, new StringOutputParser()]);
  const fixGrammarRunnableSequenceChain = RunnableSequence.from([fixGrammarTemplate, openAIChatModel, new StringOutputParser()]);
  const translateRunnableSequenceChain = RunnableSequence.from([translationTemplate, openAIChatModel, new StringOutputParser()]);

  const chain = RunnableSequence.from([
    {
      punctuated_sentence: fixPunctuationRunnableSequenceChain,
      originalQuestion: new RunnablePassthrough(),
    },
    {
      grammatically_correct_sentence: fixGrammarRunnableSequenceChain,
      language: (prevResponse) => prevResponse.originalQuestion?.language
    },
    translateRunnableSequenceChain,
  ]);

  const response = await chain.invoke({
    sentence: 'me dont liked the mondays',
    language: 'french',
  });

  console.log('response => ', response);
};
