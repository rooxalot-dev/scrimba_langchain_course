# Notes

- What are embeddings?
  - Basically, when you present a question to an A.I, it needs to translate it to a "language" it can understand, so you can think of embeddings as the language the A.I comprehends. A more techinical approach would be the following: *Embedding is a mathematical concept that refers to placing one object into a ***different*** space*.
  - We can think of it as taking a word/sentence which is in a content space and translating it to another, such as a vector or numbers, while keeping in that new format the relationship between its words and the context it's inserted into.
  - We can consider for example a two-dimmensional vector in which, the values "Queen", "Woman" and "Royalty" are close, since they have close relation in our world. Now, the word "King" is naturally different from "Queen", but still has some relation, so even though is represented farther away in the vector space, it's not so far to be something entirely different, such as the word "Space".

- What's a standalone question?
  - In term of AI prompting, a standalone question is basically a user's question reduced to it minimun number of words needed to express the request for information;
  - We have to remember that we as humans tend to overexplain and add not so necessary info to a request and in those cases, when we send the data to the A.I, it gets converted to a embedded vector, which stores the semantic meaning of our words.
  - However, with a lot of words, we are unnecessarily creating larger and more confusing vectors for the AI to interpret.
  - With a standalone question, we can extract the exact request sent by the user, increasing the assertiveness and accuracy of the answer.
