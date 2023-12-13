import { Service } from 'typedi';
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { VectorStoreRetriever } from 'langchain/dist/vectorstores/base';
import { PromptTemplate } from 'langchain/prompts';

const KEY = 'xx-xxxx';

@Service()
export class OpenAIService {
  private static openAIEmbeddingsInstance: OpenAIEmbeddings | null = null;
  private static openAIInstance: OpenAI | null = null;
  private static modelTrained: boolean = false;
  private static retrieverInstance: VectorStoreRetriever<HNSWLib>;
  private static promptTemplate = new PromptTemplate({
    template: `You are an AI counselor who would take in the student grade, 'question types' and
    categories based on which you generate questions for the student's survey. 
    The question types refer to whether the question is free text question or options based question. If it is
    options based question, you need to provide me the options as well. 
    You can read the file I have provided to understand the categories of the questions and use those questions for my queries.

    If you are not able to get the questions for given category, you can create the 
    survey questions using your intelligence.

    Here are the grades, categories and question types for which you need to generate questions for the survey
    student's grades: {grades}, categories: {categories}, questionTypes: {questionTypes}.
    
    The output should contain the response in the format of json array only whether you get response from file or generated it 
    by your intelligence and it should ignore all other details. Here is the format of the response you have to generate
    {format}. The response should not contain '\' or '\n' for escaping response and it should not also include
    the verbose text like 'I don't have access to the file mentioned'. For all the cases it should
    return response as json array.

    Based on above instructions provide me {number} questions for the survey.
    `,
    inputVariables: ["questionTypes", "categories", "grades","format", "number"],
});
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
  static async getPrompt(payload): Promise<string> {
    const categories = [payload.category, ...payload.subCategory].join('');
    const grades = payload.grades.join(',');
    const partialPrompt = await OpenAIService.promptTemplate.partial({
      questionTypes: '"Options Based Questions" and "Free text questions"',
      grades,
      number:"8",
      format: `[{text:"Give me your best career choices", options:["science","math"]}]`
  });
    const formattedPrompt = await partialPrompt.format({
        categories
    });
    console.log(formattedPrompt);
    return formattedPrompt;
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
    const question = await OpenAIService.getPrompt(payload);
    const answer = await chain.call({ query: question });
    console.log(answer);
    const formatedResponse = answer.text.replace(`"\n"`, "");
    return JSON.parse(formatedResponse);
  }
}