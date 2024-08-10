import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {useState} from "react";
import {Loader2} from "lucide-react"

export default function CreationForm({titlePlaceholder, descriptionPlaceholder, onSubmitFunction, isDocument = false}) {
	const [loading, setLoading] = useState(false)

	const formSchema = isDocument ?
		z.object({
			name: z.string().min(1, {
				message: "Title must not be blank.",
			}),
			description: z.string().min(1, {
				message: "Description must not be blank.",
			}),
		}) :
		z.object({
			name: z.string().min(1, {
				message: "Title must not be blank.",
			}),
			description: z.string().min(1, {
				message: "Description must not be blank.",
			}),
			image: z.any().refine((files) => files?.length > 0, {
				message: "A cover image is required for submission.",
			}),
		});

	const form = useForm({
		resolver: zodResolver(formSchema),
	});

	const submitWrapper = async (e) => {
		setLoading(true)
		await onSubmitFunction(e)
		setLoading(false)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(submitWrapper)} className="w-full space-y-4 px-1 m-4 pr-8">
				<FormField control={form.control} name="name" render={({field}) => (
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
				{!isDocument && (
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
				)}
				{
					loading ? (
						<Button className={"bg-[#245D00]"} disabled>
							<Loader2 className="mr-2 h-4 w-4 animate-spin"/>
							Please wait
						</Button>
					) : (
						<Button className="bg-[#245D00]" type="submit">Submit</Button>
					)
				}

			</form>
		</Form>
	)
}