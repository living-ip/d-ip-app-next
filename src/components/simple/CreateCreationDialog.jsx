import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormEditor from "@/components/editor/FormEditor";
import { createCreation } from "@/lib/creations";
import { DatePickerWithPresets } from "@/components/simple/DatePicker";

export function CreateCreationDialog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [image, setImage] = useState(null);
  const [deadline, setDeadline] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("reward", reward);
    if (image) {
      formData.append("image", image);
    }
    if (deadline) {
      formData.append("deadline", deadline.getTime()); // Convert to milliseconds
    }
    
    try {
      await createCreation(formData);
      // Handle successful creation (e.g., show a success message, close dialog)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error creating creation:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Creation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Creation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormEditor
            value={description}
            onChange={(value) => setDescription(value)}
          />
          <Input
            placeholder="Reward"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
          <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <DatePickerWithPresets date={deadline} setDate={setDeadline} />
          </div>
          <Button type="submit">Create Creation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
