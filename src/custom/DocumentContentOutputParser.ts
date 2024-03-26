import {  } from '@langchain/core/output_parsers';
import { DocumentInterface } from '@langchain/core/documents';

export class DocumentContentOutputParser {

  /**
   *
   * @param retrievedData List of DocumentInterfaces
   * @returns list of parsed strings for each document
   */
  static parse(retrievedData: DocumentInterface<Record<string, any>>[]) {
    return retrievedData.map((data => data.pageContent)).join('\n\n');
  }
}
