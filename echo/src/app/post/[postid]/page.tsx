import Post from "@/components/post/Post";
import { fetchGetPostsThread } from "@/utils/api/fetchPost";

export default async function Page({ params }: { params: Promise<{ postId: string }>}) {
    const { postId } = await params;

    try {
        const response = await fetchGetPostsThread(Number(postId));
        if (!response) throw new Error(`response is null`);

        return (
            <div>
                <h1>게시글 상세 페이지</h1>
                <Post response={response} postId={Number(postId)}/>
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