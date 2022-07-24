import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import { OpenApiService } from './open-api.service';
import {PostPromptDto} from "../dto/post-prompt-dto";
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class OpenApiController {
  constructor(private readonly openApiService: OpenApiService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async postPrompt(@Body() body: PostPromptDto): Promise<unknown> {
    return this.openApiService.fetchAdaPrompt(body.prompt);
  }
}
