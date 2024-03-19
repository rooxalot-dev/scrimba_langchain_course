import { config } from 'dotenv';

import { loadVectorstore } from './loadVectorStore';

config();
loadVectorstore();
