import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

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
    sentence: {puntuated_sentence}
    sentence with correct grammar:
  `);
  const translationTemplate = PromptTemplate.fromTemplate(`
    Given a sentence, translate it to the desired language.
    sentence: {fixed_sentence}
    language: {language}
    translated sentence:
  `);

  const response = chain.invoke({
    sentence: 'i dont liked mondays',
    language: 'french',
  })
};
