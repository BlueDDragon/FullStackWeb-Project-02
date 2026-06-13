import { fetchPostGetResponse } from "@/utils/api/fetchPost";
import styles from "./page.module.css";
import Home from "@/components/home/Home";

export default async function Page() {
    const response = await fetchPostGetResponse();

    return (
        <div>
            <Home response={response}/>
        </div>
    );
}