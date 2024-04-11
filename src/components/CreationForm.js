import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {useRouter} from "next/router";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AiOutlineCamera} from "react-icons/ai";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title must not be blank.",
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

export default function CreationForm({reportDetails}) {
  const router = useRouter();

  const isUpdateMode = reportDetails !== undefined;

  const form = useForm(isUpdateMode ? {
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: reportDetails?.title || "",
      description: reportDetails?.description || "",
    },
  } : {
    resolver: zodResolver(createProjectSchema),
  });

  const [title, setTitle] = React.useState(reportDetails?.title || "");
  const [description, setDescription] = React.useState(reportDetails?.description || "");
  const [imageFileName, setImageFileName] = React.useState(reportDetails?.image_uri || "");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFileName(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFileName("");
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Exclude "data:{mime};base64,"
      reader.onerror = (error) => reject(error);
    });
  }

  const onSubmit = async (data) => {
    if (data.image) {
      data.image = {
        filename: data.image[0].name,
        content: await fileToBase64(data.image[0]),
      };
    }

    const payload = {
      title: data.title,
      description: data.description,
      image: data.image,
    };
    console.log("Payload :", payload);

    if (isUpdateMode) {
      await updateProject(reportDetails.id, payload);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 px-8 mb-8">
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