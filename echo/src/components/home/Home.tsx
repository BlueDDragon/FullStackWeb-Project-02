import HomePost from "./HomePost";
import HomePostList from "./HomePostList";

export default function Home() {
    return (
        <div>
            <h1>Echo</h1>
            <HomePost/>
            <HomePostList/>
        </div>
    );
}