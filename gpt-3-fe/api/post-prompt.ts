import axios from "axios";


const postPrompt = async (prompt: string) => {
    const response = await axios.post('/api/prompt', {prompt});

    return response.data;
}

export default postPrompt;
