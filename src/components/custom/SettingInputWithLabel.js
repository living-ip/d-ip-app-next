import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import * as React from "react";


export function InputWithLabel({label, type, id, placeholder}) {
  return (
    <div className="mt-3 font-medium leading-[143%] text-neutral-800 max-md:max-w-full">
      <Label htmlFor={label}>{label}</Label>
      <div className="justify-center mt-2 leading-[143%] max-md:max-w-full">
        <Input type={type} id={id} placeholder={placeholder}/>
      </div>
    </div>
  );
}