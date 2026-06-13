import Post from "@/components/post/Post";
import { fetchPostGetResponse } from "@/utils/api/fetchPost";

export default async function Page({ params }: { params: Promise<{ userid: string, postid: string }>}) {
    const { userid, postid } = await params;
    const response = await fetchPostGetResponse();

    return (
        <div>
            <h1>게시글 상세 페이지</h1>
            <Post response={response} userid={userid} postid={postid}/>
        </div>
    );
}