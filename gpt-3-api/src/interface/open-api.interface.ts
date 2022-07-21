export interface IOpenApiCompletionResponse {
    "id": string,
    "object": "text_completion",
    "created": number,
    "model": string,
    "choices": []
}

export interface IOpenApiCompletionChoice {
    "text": string,
    "index": number,
    "logprobs": null | any,
    "finish_reason": string
}
