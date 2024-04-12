import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AiOutlineCamera} from "react-icons/ai";
import {useState} from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must not be blank.",
  }),
  description: z.string().min(1, {
    message: "Description must not be blank.",
  }),
});

const createProjectSchema = formSchema.extend({
  image: z.any().refine((files) => (files?.length > 0), {
    message: "A cover image is required for submission.",
  }),
});

export default function CreateEditForm({formType, formDetails, onSubmitFunction}) {

  const isUpdateMode = formDetails !== undefined;

  const form = useForm(
    formType === "project"
      ? isUpdateMode
        ? {
          resolver: zodResolver(createProjectSchema),
          defaultValues: {
            name: formDetails?.name,
            description: formDetails?.description,
            image: formDetails?.image_uri,
          },
        }
        : {
          resolver: zodResolver(createProjectSchema),
        }
      : formType === "document"
        ? isUpdateMode
          ? {
            resolver: zodResolver(formSchema),
            defaultValues: {
              name: formDetails?.name,
              description: formDetails?.description,
            },
          }
          : {
            resolver: zodResolver(formSchema),
          }
        : null
  );

  const [name, setName] = useState(formDetails?.name);
  const [description, setDescription] = useState(formDetails?.description);
  const [imageFileName, setImageFileName] = useState(formDetails?.image_uri);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitFunction)} className="w-full space-y-4 px-8 mb-8">
        <FormField control={form.control} name="name" render={({field}) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder={name}
                value={name}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setName(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="description" render={({field}) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder={description}
                value={description}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  setDescription(e.target.value)
                }}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        {formType === "project" && (
          <>
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
          </>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}