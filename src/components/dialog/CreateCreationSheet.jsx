'use client'

import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DatePickerWithPresets from "@/components/simple/DatePicker"
import FormEditor from "@/components/editor/FormEditor"
import { useToast } from "@/components/ui/use-toast"
import {createCreationRequest} from "@/lib/creations";
import {useRouter} from "next/router";
import {getAuthToken} from "@dynamic-labs/sdk-react-core"

export default function CreateCreationSheet() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm()
  const { toast } = useToast()

  const onSubmit = async (data) => {
    const creationData = {
      title: data.title,
      description: data.description,
      reward: data.reward,
      deadline: data.deadline ? data.deadline.getTime().toString() : (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(),
    }

    if (data.image[0]) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        creationData.image = reader.result.split(',')[1] // Get base64 encoded part

        try {
          await createCreationRequest(router.query.pid, creationData, getAuthToken())
          toast({
            title: "Creation successful",
            description: "Your new creation has been added.",
          })
          setOpen(false)
          reset()
        } catch (error) {
          console.error("Error creating creation:", error)
          toast({
            title: "Error",
            description: "There was a problem creating your creation.",
            variant: "destructive",
          })
        }
      }
      reader.readAsDataURL(data.image[0])
    } else {
      try {
        await createCreationRequest(router.query.pid, creationData, getAuthToken())
        toast({
          title: "Creation successful",
          description: "Your new creation has been added.",
        })
        setOpen(false)
        reset()
      } catch (error) {
        console.error("Error creating creation:", error)
        toast({
          title: "Error",
          description: "There was a problem creating your creation.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Create Creation</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Create Creation</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
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
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {/*<div className="space-y-1">*/}
          {/*  <Label htmlFor="deadline">Deadline</Label>*/}
          {/*  <Controller*/}
          {/*    name="deadline"*/}
          {/*    control={control}*/}
          {/*    render={({ field }) => (*/}
          {/*      <DatePickerWithPresets*/}
          {/*        date={field.value}*/}
          {/*        setDate={(date) => field.onChange(date)}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="space-y-1">
            <Label htmlFor="reward">Reward</Label>
            <Input
              id="reward"
              {...register("reward", { required: "Reward is required" })}
              aria-invalid={errors.reward ? "true" : "false"}
            />
            {errors.reward && <p className="text-sm text-destructive">{errors.reward.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              {...register("image")}
            />
          </div>

          <Button type="submit" className="w-full">Create Creation</Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
