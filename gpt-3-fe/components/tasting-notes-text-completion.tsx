import {FC, useState} from "react";
import TextForm from "./text-form";
import {FormikHelpers} from "formik";
import tastingNotesTextCompletionRequest from "../api/tasting-notes-text-completion.request";

const TastingNotesTextCompletion: FC = () => {
    const [results, setResults] = useState<string[]>([]);

    const handleSubmit = async ({text: prompt}: { text: string }, _: FormikHelpers<any>) => {
        const response = await tastingNotesTextCompletionRequest(prompt);
        setResults(response?.choices.map((choice: { text: string }) => {
            let completion = choice.text;
            if (!['.', '!', '?'].includes(completion[completion.length - 1])) {
                completion += ' …'
            }
            return `${prompt} ${completion}`;
        }))
    }

    return (
        <>
            <h1>Generate Tasting Notes</h1>
            <TextForm handleSubmit={handleSubmit}/>
            <ol>
                {results.map(text => <li>{text}</li>)}
            </ol>
        </>
    )
}

export default TastingNotesTextCompletion;
