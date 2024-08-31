import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEditor } from "@/components/editor/FormEditor";
import { DatePickerWithPresets } from "@/components/ui/date-picker";
import { createCreation } from "@/lib/creations";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function CreateCreationSheet({ open, onOpenChange }) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [image, setImage] = useState(null);
  const [deadline, setDeadline] = useState(new Date());
  const { pid } = useParams();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("reward", data.reward);
    formData.append("deadline", deadline.getTime());
    if (image) {
      formData.append("image", image);
    }

    try {
      await createCreation(pid, formData);
      toast({
        title: "Creation created successfully",
        description: "Your new creation has been added to the project.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating creation:", error);
      toast({
        title: "Error creating creation",
        description: "There was a problem creating your creation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Creation</SheetTitle>
          <SheetDescription>Add a new creation to your project.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title", { required: true })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <FormEditor
              id="description"
              {...register("description", { required: true })}
              onChange={(value) => setValue("description", value)}
            />
          </div>
          <div>
            <Label htmlFor="reward">Reward</Label>
            <Input
              id="reward"
              type="number"
              {...register("reward", { required: true, min: 0 })}
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <DatePickerWithPresets
              date={deadline}
              setDate={setDeadline}
            />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit">Create</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
