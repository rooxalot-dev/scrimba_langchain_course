import { config } from 'dotenv';

import { initScrimbaChatbotRoutine } from './routines/scrimbaChatBotRoutine';
import { initRunnableSequenceDemoRoutine } from './routines/runnableSequenceDemoRoutine';

config();

//initScrimbaChatbotRoutine();
initRunnableSequenceDemoRoutine();
