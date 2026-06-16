import Post from "@/components/post/Post";
import { fetchPostDetail } from "@/utils/api/fetchPost";

export default async function Page({ params }: { params: Promise<{ postid: string }>}) {
    const { postid } = await params;

    try {
        const response = await fetchPostDetail(Number(postid));
        if (!response) throw new Error(`response is null`);

        return (
            <div>
                <h1>게시글 상세 페이지</h1>
                <Post response={response} postid={postid}/>
            </div>
        );
    } catch (error) {

        return (
            <div>
                <p>서버와 연결이 끊겼습니다.</p>
            </div>
        );
    }

}