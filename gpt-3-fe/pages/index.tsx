import type {NextPage} from 'next'
import PostPromptForm from "../components/post-prompt-form";
import {FormikHelpers} from "formik";
import postPrompt from "../api/post-prompt";
import {useState} from "react";


const Home: NextPage = () => {
    const [result, setResult] = useState<string>('');

    const handleSubmit = async ({prompt}: { prompt: string }, _: FormikHelpers<any>) => {
        const response = await postPrompt(prompt);
        setResult(`${prompt} ${response?.choices[0].text}`)
    }

    return (
        <div>
            <h1>Chaucer Prompt</h1>
            <PostPromptForm handleSubmit={handleSubmit}/>
            <div>
                {result}
            </div>
        </div>
    )
}

export default Home
