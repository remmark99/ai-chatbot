"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";

export default function FileInputButton() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log("Selected files:", files);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        name="file"
      />
      <Button type="button" onClick={handleButtonClick}>Загрузить файл <Paperclip className="-rotate-45" /></Button>
    </>
  );
}
