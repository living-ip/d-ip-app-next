import * as React from "react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
// import {createUserProfile} from "@/lib/api";

export function RegisterCard() {
    const [name, setName] = useState("");
    const [persona, setPersona] = useState("");

    const router = useRouter();

    const handlePersonaChange = (value) => {
        setPersona(value);
    };

    const handleSubmit = async () => {
        console.log({name, persona});
        const response = await createUserProfile({name, persona});
        console.log("success", response);
        await router.push("/onboard")
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Create profile</CardTitle>
                <CardDescription>Get matches that are truly relevant to you</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="persona">Persona</Label>
                            <Select onValueChange={handlePersonaChange}>
                                <SelectTrigger id="personas">
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="explorer">Explorer</SelectItem>
                                    <SelectItem value="founder">Founder</SelectItem>
                                    <SelectItem value="philanthropist">Philanthropist</SelectItem>
                                    <SelectItem value="politician">Politician</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={handleSubmit}>Explore</Button>
            </CardFooter>
        </Card>
    );
}
