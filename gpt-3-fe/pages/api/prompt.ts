import type {NextApiRequest, NextApiResponse} from 'next'
import {getAccessToken} from '@auth0/nextjs-auth0';
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {accessToken} = await getAccessToken(req, res);

        const prompt = req.body.prompt
        const response = await axios.post('http://localhost:8080', {prompt}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.status(200).json(response.data);
    } catch (e) {
        res.status(500).end();
    }
}
