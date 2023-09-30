import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";

export default function EditMenu({saveHandler, submitHandler}) {
    const router = useRouter();
    return (<>
            <div className="flex ml-2">
                <Button variant="outline" className="mx-2" onClick={() => {router.back()}}>Back</Button>
                <Button className="mx-2" onClick={saveHandler}>Save</Button>
                <Button className="mx-2" onClick={submitHandler}>Submit</Button>
            </div>
        </>

    )
}