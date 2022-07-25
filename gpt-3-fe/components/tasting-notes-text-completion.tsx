import {FC, useState} from "react";
import TextForm from "./text-form/text-form";
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
        <div>
            <h2>Generate Tasting Notes</h2>
            <TextForm handleSubmit={handleSubmit} buttonText={'Generate'}/>
            <ol>
                {results.map(text => <li><span>{text}</span></li>)}
            </ol>
        </div>
    )
}

export default TastingNotesTextCompletion;
