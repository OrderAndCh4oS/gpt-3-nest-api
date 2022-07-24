import {FC, useState} from "react";
import TextForm from "./text-form";
import {FormikHelpers} from "formik";
import wineRecommendationRequest from "../api/wine-recommendation.request";
import WineSuggestion from "./wine-suggestion";

interface IResults {
    search: IWine[],
    recommendations: IWine[]
}

export interface IWine {
    name: string,
    country: string,
    region: string,
    score: string,
    vintage: string,
    notes: string
}

const regex = /^NAME: (?<name>.*?), COUNTRY: (?<country>.*?), REGION: (?<region>.*?), VINTAGE: (?<vintage>.*?), SCORE: (?<score>.*?), NOTES: (?<notes>.*?)$/;

const TastingNotesTextCompletion: FC = () => {
    const [results, setResults] = useState<IResults>({search: [], recommendations: []});

    const handleSubmit = async ({text: query}: { text: string }, _: FormikHelpers<any>) => {
        const response = await wineRecommendationRequest(query);
        const search: IWine[] = [];
        for (const searchResult of response.search) {
            const result = regex.exec(searchResult);
            if (!result?.groups) continue;
            search.push(result.groups as unknown as IWine);
        }
        const recommendations: IWine[] = [];
        for (const recommendationResult of response.recommend) {
            const result = regex.exec(recommendationResult);
            if (!result?.groups) continue;
            recommendations.push(result.groups as unknown as IWine);
        }
        setResults({search, recommendations})
        // console.log(response);
    }

    return (
        <>
            <h1>Wine Recommendations</h1>
            <TextForm handleSubmit={handleSubmit}/>
            <h2>Search Results</h2>
            <div>
                {results.search.map(wine => <WineSuggestion wine={wine}/>)}
            </div>
            <h2>Recommendations</h2>
            <div>
                {results.recommendations.map(wine => <WineSuggestion wine={wine}/>)}
            </div>
        </>
    )
}

export default TastingNotesTextCompletion;
