import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePickerWithPresets from "@/components/simple/DatePicker";
import FormEditor from "@/components/editor/FormEditor";
import { createCreation } from "@/lib/creations";
import { useToast } from "@/components/ui/use-toast";
import { useClickOutside } from "./useClickOutside";

export default function CreateCreationDialog() {
  const [open, setOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
  const { toast } = useToast();

  const handleClose = useCallback(() => {
    if (!isDatePickerOpen) {
      setOpen(false);
    }
  }, [isDatePickerOpen]);

  const dialogRef = useClickOutside(handleClose);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("reward", data.reward);
    if (data.image[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.deadline) {
      formData.append("deadline", data.deadline.getTime().toString());
    }

    try {
      await createCreation(formData);
      toast({
        title: "Creation successful",
        description: "Your new creation has been added.",
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating creation:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your creation.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Creation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" ref={dialogRef}>
        <DialogHeader>
          <DialogTitle>Create Creation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormEditor
                  id="description"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="reward">Reward</Label>
            <Input
              id="reward"
              {...register("reward", { required: "Reward is required" })}
              aria-invalid={errors.reward ? "true" : "false"}
            />
            {errors.reward && <p className="text-sm text-red-500">{errors.reward.message}</p>}
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              {...register("image")}
            />
          </div>

          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <DatePickerWithPresets
                  date={field.value}
                  setDate={field.onChange}
                  onOpenChange={setIsDatePickerOpen}
                />
              )}
            />
          </div>

          <Button type="submit">Create Creation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}