"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

const ImageUpload = ({
  value,
  disabled,
  onChange,
  onRemove
}: {
  value: string[];
  disabled: boolean;
  onChange: (url: string) => void;
  onRemove: () => void;
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  return (
    <div className="">
      <div className="mb-4">
        {value.map((url) => (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border-gray-950 border-2 bg-[#e8e3ee]" key={url}>
            <div className="absolute z-10 top-2 right-2">
                <Button type="button" size='icon' variant="destructive" disabled={disabled}>
                    <Trash onClick={onRemove}/>
                </Button>
            </div>
            <Image src={url} alt="billboard image" fill className="object-contain"/>
          </div>
        ))}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset="surqsmus">
        {({ open }) => {
          return <Button type="button" variant="secondary" onClick={() => open()} disabled={disabled}> 
            <ImagePlus size={15} className="mr-2"/>
            Upload an Image
        </Button>;
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
