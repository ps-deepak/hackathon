import { OpenAI } from "langchain/llms/openai";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RetrievalQAChain } from 'langchain/chains';

const KEY = 'xxxxx';

const start = async () => {
    const model = new OpenAI({
      modelName: 'gpt-4',
      openAIApiKey: KEY,
    });
    const loader = new CSVLoader("./output.csv");

    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 10 });
    const splittedDocs = await splitter.splitDocuments(docs);
    const embeding = new OpenAIEmbeddings({ openAIApiKey: KEY });
    const vectorStore = await HNSWLib.fromDocuments(
        splittedDocs,
        embeding
    );

    const retriever = vectorStore.asRetriever();
    const chain = RetrievalQAChain.fromLLM(model, retriever);
    const question = 'Give me 5 question belonging to category social-emotional';
    const answer = await chain.call({ query: question });
    console.log(answer);
}
start();