import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {useRouter} from "next/router";
import {createCollection} from "@/lib/app/collection";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title must not be blank.",
  }),
  description: z.string().min(1, {
    message: "Description must not be blank.",
  }),
  image: z.any().refine((files) => files?.length > 0, {
    message: "A cover image is required for submission.",
  }),
});

export default function CreationForm({titlePlaceholder, descriptionPlaceholder, onSubmitFunction}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitFunction)} className="w-full space-y-4 px-8 mb-8">
        <FormField control={form.control} name="title" render={({field}) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder={titlePlaceholder} {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="description" render={({field}) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder={descriptionPlaceholder} {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
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