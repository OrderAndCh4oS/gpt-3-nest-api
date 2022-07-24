import {FC} from "react";
import {IWine} from "./wine-recommendations";

const WineSuggestion: FC<{wine: IWine}> = ({wine}) => {
    return (
        <>
            <h3>{wine.name}</h3>
            <p>{wine.country}, {wine.region}</p>
            <p>{wine.vintage}</p>
            <p>Score {wine.score}</p>
            <p>{wine.notes}</p>
        </>
    )
}

export default WineSuggestion;
