import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Exclude "data:{mime};base64,"
    reader.onerror = (error) => reject(error);
  });
}

export function convertNameToGithubRepo(name) {
  return name.toLowerCase().replace(/[^a-z0-9._]/g, "-");
}