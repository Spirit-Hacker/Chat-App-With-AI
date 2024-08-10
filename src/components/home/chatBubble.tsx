import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chatStore";
import ChatBubbleAvatar from "./chatBubbleAvatar";
import DateIndicator from "./dateIndicator";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import ReactPlayer from "react-player";
import ChatBubbleAvatarActions from "./chatBubbleAvatarActions";

type ChatBubbleProps = {
  message: IMessage;
  me: any;
  previousMessage?: IMessage;
};

const ChatBubble = ({ message, me, previousMessage }: ChatBubbleProps) => {
  const { selectedConversation } = useConversationStore();
  const date = new Date(message._creationTime);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const time = `${hour}:${minute}`;

  const isMember = selectedConversation!.participants.includes(
    message!.sender._id
  );
  const isGroup = selectedConversation?.isGroup;
  const fromMe = message.sender._id === me!._id;
  const bgClass = fromMe ? "bg-green-chat" : "bg-white dark:bg-gray-primary";

  const [open, setOpen] = useState<boolean>(false);

  const renderMessageContent = () => {
    switch (message.messageType) {
      case "text":
        return <TextMessage message={message} />;
      case "image":
        return (
          <ImageMessage message={message} handleClick={() => setOpen(true)} />
        );
      case "video":
        return <VideoMessage message={message} />;
      default:
        return null;
    }
  };

  if (!fromMe) {
    return (
      <>
        <DateIndicator message={message} previousMessage={previousMessage} />
        <div className="flex gap-1 w-2/3 mr-auto pl-1">
          <ChatBubbleAvatar
            message={message}
            isMember={isMember}
            isGroup={isGroup}
          />
          <div
            className={`flex flex-col z-20 mr-auto max-w-fit px-2 py-1 rounded-md shadow-md relative ${bgClass}`}
          >
            <OtherMessageIndicator />
            {isGroup && <ChatBubbleAvatarActions 
              message={message}
              me={me}
            />}
            {renderMessageContent()}
            {open && (
              <ImageDialog
                open={open}
                src={message.content}
                onClose={() => setOpen(false)}
              />
            )}
            <MessageTime time={time} fromMe={fromMe} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DateIndicator message={message} previousMessage={previousMessage} />
      <div className="flex gap-1 ml-auto w-2/3">
        <div
          className={`flex flex-col z-20 max-w-fit ml-auto px-2 py-1 rounded-md shadow-md relative ${bgClass}`}
        >
          <SelfMessageIndicator />
          {renderMessageContent()}
          {open && (
            <ImageDialog
              open={open}
              src={message.content}
              onClose={() => setOpen(false)}
            />
          )}
          <MessageTime time={time} fromMe={fromMe} />
        </div>
      </div>
    </>
  );
};

export default ChatBubble;

const VideoMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="w-[100%] pr-2">
      <ReactPlayer
        url={message.content}
        controls={true}
        width={"250px"}
        height={"100%"}
        light={true}
      />
    </div>
  );
};

const ImageDialog = ({
  open,
  src,
  onClose,
}: {
  open: boolean;
  src: string;
  onClose: () => void;
}) => {
  console.log("SRC: ", src);
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="min-w-[750px]">
        <DialogDescription className="relative h-[450px] flex justify-center">
          <Image
            src={src}
            fill
            className="rounded-lg object-contain"
            alt="image"
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

const ImageMessage = ({
  message,
  handleClick,
}: {
  message: IMessage;
  handleClick: () => void;
}) => {
  return (
    <div className="relative m-2 w-[250px] h-[250px]">
      <Image
        src={message.content}
        fill
        className="cursor-pointer rounded object-cover"
        alt="image"
        onClick={handleClick}
      />
    </div>
  );
};

const OtherMessageIndicator = () => {
  return (
    <div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3  rounded-bl-full" />
  );
};
const SelfMessageIndicator = () => {
  return (
    <div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden" />
  );
};

const TextMessage = ({ message }: { message: IMessage }) => {
  const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content);

  return (
    <div className="max-w-[300px] break-words">
      {isLink ? (
        <a
          href={message.content}
          target="_blank"
          rel="noopener noreferrer"
          className={`mr-2 text-sm font-light text-blue-400 underline`}
        >
          {message.content}
        </a>
      ) : (
        <p className={`mr-2 text-sm font-light`}>{message.content}</p>
      )}
    </div>
  );
};

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
  return (
    <p className="text-[10px] mt-2 self-end flex items-center gap-1">
      {time} {fromMe && <MessageSeenSvg />}
    </p>
  );
};
