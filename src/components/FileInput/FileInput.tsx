import React, { ChangeEvent, ChangeEventHandler, useRef } from 'react';

export interface FileInputProps {
  onFiles?: (files: FileList) => void;
}

export const FileInput = ({onFiles}: FileInputProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (onFiles) {
      onFiles(event.target.files as FileList);
    }
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  return <input ref={fileInputRef} type="file" onChange={handleChange} />
}
