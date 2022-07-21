import axios from "axios";
import * as yup from "yup";


const postPrompt = async (prompt: string) => {
    const response = await axios.post('http://localhost:8080', {prompt});

    return response.data;
}

export default postPrompt;
