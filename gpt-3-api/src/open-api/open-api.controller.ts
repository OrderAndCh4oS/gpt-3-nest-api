import {Body, Controller, Get, Post} from '@nestjs/common';
import { OpenApiService } from './open-api.service';
import {PostPromptDto} from "../dto/post-prompt-dto";

@Controller()
export class OpenApiController {
  constructor(private readonly openApiService: OpenApiService) {}

  @Post()
  async postPrompt(@Body() body: PostPromptDto): Promise<unknown> {
    return this.openApiService.fetchAdaPrompt(body.prompt);
  }
}
