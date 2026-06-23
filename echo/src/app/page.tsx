import { fetchGetPosts } from "@/utils/api/fetchPost";
import styles from "./page.module.css";
import Home from "@/components/home/Home";
import ErrorPage from "@/components/common/Error";

export default async function Page() {
    try {
        const resGetPosts = await fetchGetPosts();

        return (
            <div>
                <h1>게시글 상세 페이지</h1>
                <Home resGetPosts={resGetPosts}/>
            </div>
        );
    } catch (error) {
        return <ErrorPage info={`서버와 연결이 끊겼습니다. ${error}`}/>;
    }
}