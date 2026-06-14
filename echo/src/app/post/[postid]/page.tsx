import Post from "@/components/post/Post";
import { fetchPostGetResponse } from "@/utils/api/fetchPost";

export default async function Page({ params }: { params: Promise<{ postid: string }>}) {
    const { postid } = await params;
    const response = await fetchPostGetResponse();

    return (
        <div>
            <h1>게시글 상세 페이지</h1>
            <Post response={response} postid={postid}/>
        </div>
    );
}