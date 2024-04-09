import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AiOutlineCamera} from "react-icons/ai";

export default function CreationForm({titlePlaceholder, descriptionPlaceholder, onSubmitFunction, optionalImage}) {
  const router = useRouter();
  const [imageFileName, setImageFileName] = useState(optionalImage || "");
  const [title, setTitle] = useState(titlePlaceholder);
  const [description, setDescription] = useState(descriptionPlaceholder);

  const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title must not be blank.",
    }),
    description: z.string().min(1, {
      message: "Description must not be blank.",
    }),
    image: z.any().refine((files) => (files?.length > 0 || optionalImage), {
      message: "A cover image is required for submission.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title || "",
      description: description || "",
      image: optionalImage || null,
    },
  });

  useEffect(() => {
    console.log("optionalImage", optionalImage);
  }, [optionalImage]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitFunction)} className="w-full space-y-4 px-8 mb-8">
        <FormField control={form.control} name="title" render={() => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder={titlePlaceholder} value={title} onChange={e => setTitle(e.target.value)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="description" render={() => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder={descriptionPlaceholder} value={description}
                        onChange={e => setDescription(e.target.value)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <Avatar className="relative inline-block w-64 h-32 rounded-none">
          {imageFileName ? (
            <AvatarImage
              src={imageFileName}
              alt="Profile picture"
              className="object-cover"
            />
          ) : (
            <div className="w-64 h-32 rounded-none bg-gray-100 flex justify-center items-center">
              <AiOutlineCamera size={32} className="text-gray-600"/>
            </div>
          )}
        </Avatar>
        <FormField control={form.control} name="image" render={({field: {onChange, onBlur, name, ref}}) => (
          <FormItem>
            <FormLabel htmlFor="image">Cover Image</FormLabel>
            <FormControl>
              <Input
                id="image"
                name={name}
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  // react-hook-form expects a FileList, so provide it from the event
                  onChange(e.target.files);
                  setImageFileName(URL.createObjectURL(e.target.files[0]));
                }}
                onBlur={onBlur}
                ref={ref}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}