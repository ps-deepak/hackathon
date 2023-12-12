import "reflect-metadata";
import Container from 'typedi';
import { OpenAIService } from './langchain';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { IsDefined, IsString } from 'class-validator';
import { createExpressServer, JsonController, Post, Body } from "routing-controllers";

class RecomendedSurveyPayload {
  grades: number[];
  subCategory: string[];

  @IsDefined()
  @IsString()
  category: string;
}

@JsonController("/api")
class SurveyRecommendationController {
  private OpenAIService;
  constructor() {
    this.OpenAIService = Container.get(OpenAIService);
  }
  @Post("/get-recomended-survey")
  public async submitData(
    @Body() payload: RecomendedSurveyPayload
  ): Promise<any> {
    await this.OpenAIService.getRecomendedSurvey(payload);
    return { success: true, data: [
      {
        id: 1,
        text: 'What is your favorite color?',
        options: ['Red', 'Green', 'Blue', 'Yellow'],
      },
      {
        id: 2,
        text: 'Who is your favorite person?',
      }
    ] };
  }
}

const app = createExpressServer({
  controllers: [SurveyRecommendationController]
});

app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


