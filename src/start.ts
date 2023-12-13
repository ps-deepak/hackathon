import "reflect-metadata";
import Container from 'typedi';
import { OpenAIService } from './langchain';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from "express";
import { IsDefined, IsString } from 'class-validator';
import { createExpressServer, JsonController, Post, Body, useExpressServer } from "routing-controllers";

class RecomendedSurveyPayload {
  grades: number[];
  subCategory: string[];

  @IsDefined()
  @IsString()
  category: string;
  questionTypes: string[]
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
   const data = await this.OpenAIService.getRecomendedSurvey(payload);
    return { success: true, data };
  }
}

const app = express();

// Apply CORS middleware before routing-controllers
app.use(cors());

// Use routing-controllers
useExpressServer(app, {
  controllers: [SurveyRecommendationController],
  // Other routing-controllers options here
});
app.use(bodyParser.json());


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


