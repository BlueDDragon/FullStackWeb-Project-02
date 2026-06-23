import ErrorPage from "@/components/common/Error";
import Profile from "@/components/profile/Profile";

export default async function Page({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    try {
        return (
            <div>
                <Profile id={id}/>
            </div>
        );
    } catch (error) {
        return <ErrorPage info={`서버와 연결이 끊겼습니다. ${error}`}/>;
    }
}