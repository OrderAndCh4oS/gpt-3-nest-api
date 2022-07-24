import type {NextPage} from 'next'
import {useUser} from "@auth0/nextjs-auth0";
import TastingNotesTextCompletion from "../components/tasting-notes-text-completion";
import WineRecommendations from "../components/wine-recommendations";

const Home: NextPage = () => {
    const {user, error, isLoading} = useUser();

    if (isLoading) return <div>Authenticating…</div>
    if (error) return <div>{error.message}</div>;

    return (
        <div>
            {user ? <a href="/api/auth/logout">Logout</a> : <a href="/api/auth/login">Login</a>}
            {user && <p>Welcome {user.name}</p>}
            <TastingNotesTextCompletion/>
            <WineRecommendations/>
        </div>
    )
}

export default Home
