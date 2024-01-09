import {Container} from "@/components/ui/container";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


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

export default function CreateNewDocument() {

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    data["image"] = data.image[0];
    console.log(data);
    //TODO: write to database
  };

  return (
    <Container className={"pt-24 bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
        <Card className="w-full bg-white mt-10">
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Create a New Document</CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 px-8 mb-8">
              <FormField control={form.control} name="title" render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the name of your document" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
              <FormField control={form.control} name="description" render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write a description about your document" {...field} />
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
        </Card>
      </div>
    </Container>
  )
}