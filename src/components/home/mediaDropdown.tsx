import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ImageIcon, Plus, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import ReactPlayer from "react-player";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chatStore";
import toast from "react-hot-toast";

const MediaDropdown = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [selectedVideo, setSelectedVideo] = useState<File | null>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const sendVideo = useMutation(api.messages.sendVideo);
  const { selectedConversation } = useConversationStore();
  const me = useQuery(api.users.getMe);

  const handleSendImages = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": selectedImage!.type,
        },
        body: selectedImage,
      });

      const { storageId } = await result.json();
      await sendImage({
        conversation: selectedConversation!._id,
        sender: me!._id,
        imgId: storageId,
      });

      setSelectedImage(null);
      toast.success("Image sent");
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to send image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVideos = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": selectedVideo!.type,
        },
        body: selectedVideo,
      });

      const { storageId } = await result.json();
      await sendVideo({
        conversation: selectedConversation!._id,
        sender: me!._id,
        videoId: storageId,
      });

      setSelectedVideo(null);
      toast.success("Video sent");
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to send video");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={(e) => setSelectedImage(e.target.files![0])}
          hidden
        />
        <input
          type="file"
          accept="video/mp4"
          ref={videoInputRef}
          onChange={(e) => setSelectedVideo(e.target.files![0])}
          hidden
        />

        {selectedImage && (
          <MediaImageDialog
            isOpen={selectedImage !== null}
            onClose={() => setSelectedImage(null)}
            selectedImage={selectedImage}
            isLoading={isLoading}
            handleSendImages={handleSendImages}
          />
        )}

        {selectedVideo && (
          <MediaVideoDialog
            isOpen={selectedVideo !== null}
            onClose={() => setSelectedVideo(null)}
            selectedVideo={selectedVideo}
            isLoading={isLoading}
            handleSendVideos={handleSendVideos}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Plus className="text-gray-600 dark:text-gray-400 cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
              <ImageIcon size={18} className="mr-1" /> Photo
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => videoInputRef.current?.click()}>
              <Video size={20} className="mr-1" /> Video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    </div>
  );
};

export default MediaDropdown;

type MediaImageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: File;
  isLoading: boolean;
  handleSendImages: () => void;
};

const MediaImageDialog = ({
  isOpen,
  onClose,
  selectedImage,
  isLoading,
  handleSendImages,
}: MediaImageDialogProps) => {
  const [renderedImage, setRenderedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) return;

    const reader = new FileReader();
    reader.onload = (e) => setRenderedImage(e.target?.result as string);
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogDescription className="flex flex-col gap-10 justify-center items-center">
          {renderedImage && (
            <Image
              src={renderedImage}
              width={300}
              height={300}
              alt="selected image"
            />
          )}
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleSendImages}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

type MediaVideoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: File;
  isLoading: boolean;
  handleSendVideos: () => void;
};

const MediaVideoDialog = ({
  isOpen,
  onClose,
  selectedVideo,
  isLoading,
  handleSendVideos,
}: MediaVideoDialogProps) => {
  const renderedVideo = URL.createObjectURL(
    new Blob([selectedVideo], { type: "video/mp4" })
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogDescription>Video</DialogDescription>
        <div className="w-full">
          {renderedVideo && (
            <ReactPlayer url={renderedVideo} controls width="100%" />
          )}
        </div>

        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleSendVideos}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
