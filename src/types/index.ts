import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface DroppedFileState {
  status: "dropped";
  preview?: string;
}

export interface UploadingFileState {
  status: "uploading";
  progress: number;
}

export interface UploadedFileState {
  status: "uploaded";
  key: string;
}

export interface FileDropItem {
  id: string;
  file: File;
  state: DroppedFileState | UploadingFileState | UploadedFileState;
}