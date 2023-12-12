import { Service } from 'typedi';
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { VectorStoreRetriever } from 'langchain/dist/vectorstores/base';

const KEY = 'xxxxx';

@Service()
export class OpenAIService {
  private static openAIEmbeddingsInstance: OpenAIEmbeddings | null = null;
  private static openAIInstance: OpenAI | null = null;
  private static modelTrained: boolean = false;
  private static retrieverInstance: VectorStoreRetriever<HNSWLib>;

  public static async initializeModel(apiKey: string): Promise<void> {
    // Perform one-time setup, such as reading data from CSV and training the model
    const loader = new CSVLoader("./output.csv");
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 10 });
    const splittedDocs = await splitter.splitDocuments(docs);
    const embeding = new OpenAIEmbeddings({ openAIApiKey: apiKey });
    const vectorStore = await HNSWLib.fromDocuments(splittedDocs, embeding);
    const model = new OpenAI({ modelName: 'gpt-4', openAIApiKey: apiKey });
    const retriever = vectorStore.asRetriever();
    OpenAIService.retrieverInstance = retriever;
    OpenAIService.openAIEmbeddingsInstance = embeding;
    OpenAIService.openAIInstance = model;
    OpenAIService.modelTrained = true;
  }

  public static getOpenAIEmbeddingsInstance(): OpenAIEmbeddings {
    if (!OpenAIService.openAIEmbeddingsInstance) {
      throw new Error('OpenAIEmbeddings instance not initialized.');
    }
    return OpenAIService.openAIEmbeddingsInstance;
  }

  public static getOpenAIInstance(): OpenAI {
    if (!OpenAIService.openAIInstance) {
      throw new Error('OpenAI instance not initialized.');
    }
    return OpenAIService.openAIInstance;
  }

  public static isModelTrained(): boolean {
    return this.modelTrained;
  }

  public async getRecomendedSurvey(payload: any): Promise<any> {
    if (!OpenAIService.isModelTrained()) {
      console.log("Initializing model");
      try {
        await OpenAIService.initializeModel(KEY);
      } catch (e) {
        console.log("Error initializing model", e);
      }
    }

    const openAI = OpenAIService.getOpenAIInstance();

    const retriever = OpenAIService.retrieverInstance;
    const chain = RetrievalQAChain.fromLLM(openAI, retriever);
    const question = 'Give me 5 question belonging to category Social-emotional learning';
    const answer = await chain.call({ query: question });
    console.log(answer);
  }
}
