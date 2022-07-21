import { Test, TestingModule } from '@nestjs/testing';
import { OpenApiService } from './open-api.service';
import {OpenApiController} from "./open-api.controller";

describe('OpenApiController', () => {
  let openApiController: OpenApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OpenApiController],
      providers: [OpenApiService],
    }).compile();

    openApiController = app.get<OpenApiController>(OpenApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(openApiController.postPrompt({prompt: 'hello'})).toBe('Hello World!');
    });
  });
});
