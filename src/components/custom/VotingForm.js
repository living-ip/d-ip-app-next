import {Button} from "@/components/ui/button";
import {useState} from "react";

export function VotingForm() {
  const [vote, setVote] = useState("");

  return (
    <form className="flex flex-col justify-center px-5 py-4 font-medium rounded-2xl">
      <p className="text-lg">Cast your vote</p>
      <Button variant="outline" className="justify-center items-start mt-4" onClick={() => setVote("reject")}>
        Reject
      </Button>
      <Button variant="ghost" className="justify-center items-start mt-2">
        Approve
      </Button>
      <Button type="submit" className="justify-center items-center mt-4">
        Vote
      </Button>
    </form>
  );
}