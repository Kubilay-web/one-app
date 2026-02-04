"use client";
import { useState } from "react";
import {
  Folder,
  File,
  Upload,
  Plus,
  MoreVertical,
  ArrowLeft,
  X,
  FolderPlus,
  Pencil,
  Trash2,
  Share2,
  Download,
} from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../../components/ui/sheet";


import Link from "next/link";
import FolderForm from "../Forms/FolderForm";
import { UserFolder } from "../../types/types";
import { useSearchParams } from "next/navigation";
import { cn } from "@/app/lib/utils";
import FileUploadForm from "../Forms/FileUploadForm";
import { File as PrismaFile } from "@prisma/client";
import { getNormalDate } from "../../lib/getNormalDate";
import { formatBytes } from "../../lib/formatBytes";
import { getModifiedDate } from "../../lib/getModifiedDate";
import {
  FaFileAlt,
  FaFileArchive,
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaImage,
} from "react-icons/fa";
import { MdTextSnippet } from "react-icons/md";
import { deleteFile,deleteFolder } from "../../actions/fileManager";
import toast from "react-hot-toast";

interface FileType {
  name: string;
  type: "pdf" | "xls";
}

const VibrantProgress = ({ value }: { value: number }) => {
  const getColorClass = (percentage: number) => {
    return percentage > 50 ? "bg-red-500" : "bg-green-500";
  };

  return (
    <div className="w-48 h-2 bg-lime-50 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${getColorClass(value)}`}
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default function FileManager({
  userId,
  userFolders,
}: {
  userId: string;
  userFolders: UserFolder[];
}) {
  const [selectedFile, setSelectedFile] = useState<PrismaFile | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const params = useSearchParams();
  const selectedFolderId = params.get("fId") ?? "";
  const selectedFolder =
    userFolders.find((folder) => folder.id === selectedFolderId) ||
    userFolders[0];
  const [extension, setExtension] = useState("");

  const handleFileClick = (file: PrismaFile): void => {
    setSelectedFile(file);
    const fiLeExt = file.name.split(".").pop() as string;
    setExtension(fiLeExt);
    console.log(extension);
    setIsSheetOpen(true);
  };

  // Example usage percentage
  const usagePercentage = 65; // 65% used
  const totalSpace = Number(((2 * 1073741824) / userFolders.length).toFixed(2));
  const usedSpace = selectedFolder.files.reduce((acc, item) => {
    return acc + item.size;
  }, 0);
  function getFileIcon(extension: string | undefined) {
    switch (extension) {
      case "pdf":
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-red-100">
            <FaFilePdf className="w-6 h-6 flex-shrink-0 text-red-500" />
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-blue-100">
            <FaImage className="w-6 h-6 flex-shrink-0 text-blue-500" />
          </div>
        );
      case "doc":
      case "docx":
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-blue-100">
            <FaFileWord className="w-6 h-6 flex-shrink-0 text-blue-500" />
          </div>
        );
      case "xls":
      case "xlsx":
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-green-100">
            <FaFileExcel className="w-6 h-6 flex-shrink-0 text-green-500" />
          </div>
        );
      case "ppt":
      case "pptx":
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-orange-100">
            <FaFilePowerpoint className="w-6 h-6 flex-shrink-0 text-orange-500" />
          </div>
        );
      case "zip":
      case "gzip":
      case "tar":
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-yellow-100">
            <FaFileArchive className="w-6 h-6 flex-shrink-0 text-yellow-600" />
          </div>
        );
      case "txt":
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-gray-100">
            <MdTextSnippet className="w-6 h-6 flex-shrink-0 text-gray-500" />
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-lg bg-gray-100">
            <FaFileAlt className="w-6 h-6 flex-shrink-0 text-gray-500" />
          </div>
        ); // Default icon for other file types
    }
  }
  async function handleFolderDelete(id: string) {
    try {
      await deleteFolder(id);
      toast.success("Folder Deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  }
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = async (url: string, fileName: string = "Download") => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Download Successful");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download Failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileDelete = async (id: string) => {
    try {
      await deleteFile(id);
      toast.success("File Deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = () => {
    // Implement share logic here
    console.log("Share clicked");
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Folders</h2>
          <FolderForm userId={userId} />
        </div>
        <ScrollArea className="h-[calc(100vh-60px)]">
          {userFolders.map((folder) => {
            const usedSpace = folder.files.reduce((acc, item) => {
              return acc + item.size;
            }, 0);
            return (
              <Link
                href={`/dashboard/file-manager?fId=${folder.id}`}
                key={folder.name}
                className={cn(
                  "flex items-center border-b p-4 hover:bg-blue-50 ",
                  selectedFolder.id === folder.id && "bg-blue-50"
                )}
              >
                <Folder className="mr-2 text-blue-500" />
                <div>
                  <div>{folder.name}</div>
                  <div className="text-sm text-gray-500">
                    {folder.files.length} items · {formatBytes(usedSpace)}
                  </div>
                </div>
              </Link>
            );
          })}
        </ScrollArea>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
            <span className="ml-2 text-lg font-semibold">
              {selectedFolder.name}
            </span>
            <div className="ml-6 flex items-center space-x-2">
              {/* <EditFolderName /> */}
              <FolderForm
                initialContent={selectedFolder?.name}
                editingId={selectedFolder.id}
                userId={userId}
              />
              <button
                onClick={() => handleFolderDelete(selectedFolder.id)}
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <FileUploadForm folderId={selectedFolder.id} />
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm text-gray-500">
              Folders / {selectedFolder.name}
            </div>
            <div className="flex items-center mt-1">
              <VibrantProgress value={usagePercentage} />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {formatBytes(usedSpace)} of {formatBytes(totalSpace)} used
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {selectedFolder.files.map((file, index) => {
              const fiLeExt = file.name.split(".").pop() as string;
              return (
                <button
                  key={index}
                  className="p-4 border rounded-lg text-center hover:bg-gray-50"
                  onClick={() => handleFileClick(file)}
                >
                  {getFileIcon(fiLeExt)}
                  <div className="text-sm truncate">{file.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>File Information</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </SheetClose>
          </SheetHeader>
          {/* const extension = file.title.split(".").pop();  */}
          {selectedFile && (
            <div className="mt-4">
              <div className="mb-4">
                {getFileIcon(extension)}
                <div className="text-center font-semibold">
                  {selectedFile.name}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{getNormalDate(selectedFile.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Size</span>
                  <span>{formatBytes(selectedFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Format</span>
                  <span>{selectedFile.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Modified</span>
                  <span>{getModifiedDate(selectedFile.updatedAt)}</span>
                </div>
              </div>
              <div className="border-t pt-3 mt-3 flex flex-col sm:flex-row gap-4 items-center justify-center p-4 bg-background ">
                <Button
                  onClick={() =>
                    handleDownload(selectedFile.url, selectedFile.name)
                  }
                  disabled={isDownloading}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
                <Button
                  onClick={() => handleFileDelete(selectedFile.id)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                {/* <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button> */}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
