import { fetchPostFindAll } from "@/utils/api/fetchPost";
import styles from "./page.module.css";
import Home from "@/components/home/Home";
import ErrorPage from "@/components/common/Error";
import { fetchAuthMe } from "@/utils/api/fetchAuth";

export default async function Page() {
    try {
        const resAuthMe = await fetchAuthMe("");
        const resPostFindAll = await fetchPostFindAll();

        return (
            <div>
                <h1>게시글 상세 페이지</h1>
                <Home resAuthMe={resAuthMe} resPostFindAll={resPostFindAll}/>
            </div>
        );
    } catch (error) {

        return (
            <ErrorPage info={`서버와 연결이 끊겼습니다. ${error}`}/>
        );
    }
}