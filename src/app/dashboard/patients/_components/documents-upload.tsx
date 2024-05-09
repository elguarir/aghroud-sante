import { CloudUpload, FileUploadIcon } from "@/components/icons";
import useFileUpload from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { FileCard } from "./file-card";
import { Button } from "@nextui-org/button";
import { useEffect } from "react";

interface DocumentsUploadProps {
  onChange?: (
    documents: {
      name: string;
      key: string;
      contentType: string;
      fileSize: number;
    }[],
  ) => void;
}

export const DocumentsUpload = ({ onChange }: DocumentsUploadProps) => {
  const {
    clear,
    files,
    canStartUpload,
    removeFile,
    isUploading,
    getInputProps,
    getRootProps,
    isDragActive,
    open,
    startUpload,
  } = useFileUpload({});

  useEffect(() => {
    let uploadedFiles = files.filter(
      (file) => file.state.status === "uploaded",
    );

    if (uploadedFiles.length > 0) {
      onChange &&
        onChange(
          uploadedFiles.map((file) => ({
            name: file.file.name,
            key: (file.state as any).key as string,
            contentType: file.file.type,
            fileSize: file.file.size,
          })),
        );
    }
  }, [files]);

  return (
    <div className="grid w-full gap-y-4">
      <div className="flex flex-col space-y-1">
        <div
          {...getRootProps()}
          className={cn(
            "flex h-48 flex-col items-center justify-center space-y-1.5 rounded-large border-[1.8px] border-content3 p-4 text-default-500 transition-colors focus-visible:border-primary focus-visible:bg-primary-200 focus-visible:bg-opacity-10 focus-visible:outline-none",
            isDragActive && "border-primary bg-primary-200 bg-opacity-10",
            isUploading &&
              "pointer-events-none cursor-not-allowed border-content3 bg-default-100 bg-opacity-10",
          )}
        >
          <CloudUpload className="h-12 w-12" />
          <div className="text-center text-small">
            Glissez et déposez les documents ici ou <br />
            <button
              type="button"
              className="hover:text-primary hover:underline focus-visible:outline-none focus-visible:outline-primary"
            >
              choisir des fichiers
            </button>
          </div>
          <input {...getInputProps()} />
        </div>
        <div data-slot="description" className="text-tiny text-default-500">
          Ajoutez des documents pertinents pour le patient, tels que des
          rapports médicaux, des ordonnances ou des résultats de tests.
        </div>
      </div>
      <div className="grid w-full gap-y-2">
        {files.map((file) => (
          <FileCard
            key={file.id}
            id={file.id}
            file={file.file}
            state={file.state}
            remove={() => removeFile(file.id)}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="light"
          onPress={() => {
            clear();
          }}
        >
          Effacer
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            startUpload();
          }}
          isLoading={isUploading}
          isDisabled={!canStartUpload}
        >
          {isUploading ? "Téléchargement..." : "Tout télécharger"}
        </Button>
      </div>
    </div>
  );
};
