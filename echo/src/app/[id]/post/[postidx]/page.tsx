import Post from "@/components/post/Post";

export default async function Page({ params }: { params: Promise<{ id: string, postidx: string }>}) {
    const { id, postidx } = await params;

    return (
        <div>
            <h1>게시글 상세 페이지</h1>
            <Post id={id} postidx={postidx}/>
        </div>
    );
}