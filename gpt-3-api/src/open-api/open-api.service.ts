import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {OPEN_AI_API_URL} from "../constants";
import axios from "axios";
import {IErrorResponse} from "../interface/error-response";
import {IOpenApiCompletionResponse} from "../interface/open-api.interface";

@Injectable()
export class OpenApiService {
    async fetchAdaPrompt(prompt: string): Promise<IOpenApiCompletionResponse | IErrorResponse>  {
        try {
            const response = await axios.post(
                OPEN_AI_API_URL + '/completions',
                JSON.stringify({
                    // model: "curie:ft-orderandchaos-2022-07-21-19-34-30",
                    // model: "ada:ft-orderandchaos-2022-07-21-20-06-15",
                    model: "davinci:ft-orderandchaos-2022-07-24-14-52-09",
                    prompt,
                    temperature: 0.9,
                    max_tokens: 70,
                    top_p: 1,
                    frequency_penalty: 1.75,
                    presence_penalty: 0,
                    n: 3
                }),
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            if(response.status === 200)
                return response.data;
            else
                // Todo: reconsider the error handling here, perhaps throw and catch.
                return {message: "Open AI request error", error: response.data}
        } catch {
            throw new HttpException('Open AI request failed unexpectedly', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
