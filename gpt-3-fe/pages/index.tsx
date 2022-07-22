import type {NextPage} from 'next'
import PostPromptForm from "../components/post-prompt-form";
import {FormikHelpers} from "formik";
import postPrompt from "../api/post-prompt";
import {useState} from "react";
import {useUser} from "@auth0/nextjs-auth0";

const Home: NextPage = () => {
    const [result, setResult] = useState<string>('');
    const {user, error, isLoading} = useUser();

    const handleSubmit = async ({prompt}: { prompt: string }, _: FormikHelpers<any>) => {
        const response = await postPrompt(prompt);
        setResult(`${prompt} ${response?.choices[0].text}`)
    }

    if (isLoading) return <div>Authenticating…</div>
    if (error) return <div>{error.message}</div>;

    return (
        <div>
            {user ? <a href="/api/auth/logout">Logout</a> : <a href="/api/auth/login">Login</a>}
            {user && <p>Welcome {user.name}</p>}

            <h1>Chaucer Prompt</h1>
            <PostPromptForm handleSubmit={handleSubmit}/>
            <div>
                {result}
            </div>
        </div>
    )
}

export default Home
