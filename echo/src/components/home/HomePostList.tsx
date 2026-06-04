import mock_homepost from "@/mocks/mock_homepost.json"
import HomePostItem from "./HomePostItem";

export default function HomePostList() {
    const temp_homepost = [...mock_homepost.posts];

    return (
        <div>
            {temp_homepost.map((post) => <HomePostItem key={post.id} post={post}/>)}
        </div>
    );
}