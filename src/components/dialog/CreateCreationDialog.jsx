import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <div className="col-span-3">
              <FormEditor
                value={description}
                onChange={(value) => setDescription(value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reward" className="text-right">
              Reward
            </Label>
            <Input
              id="reward"
              placeholder="Reward"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="col-span-3"
              accept="image/*"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3">
              <DatePickerWithPresets date={deadline} setDate={setDeadline} />
            </div>
          </div>
          <Button type="submit" className="w-full">Create Creation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCreationDialog;
