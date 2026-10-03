import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Akshit Gupta — Software Engineer, Full Stack Developer";

export default function Image() {
  return renderOg();
}
