"use client";

import * as React from "react"
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function FileInputButton() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      console.log("[v0] Selected file:", files[0].name)
    }
  }

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
      {selectedFile ? (
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={handleClearFile}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={handleClick}>
          <Upload className="mr-2 h-4 w-4" />
          Загрузить XLSX
        </Button>
      )}
    </>
  )
}
