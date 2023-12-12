import "reflect-metadata";
import Container from 'typedi';
import { OpenAIService } from './langchain';
import * as bodyParser from 'body-parser';
import { IsDefined, IsNumber } from 'class-validator';
import { createExpressServer, JsonController, Post, Body } from "routing-controllers";

class RecomendedSurveyPayload {
  grades: number[];
  subCategory?: number;

  @IsDefined()
  @IsNumber()
  category: number;
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
    return { success: true, data: payload };
  }
}

const app = createExpressServer({
  controllers: [SurveyRecommendationController]
});

app.use(bodyParser.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


