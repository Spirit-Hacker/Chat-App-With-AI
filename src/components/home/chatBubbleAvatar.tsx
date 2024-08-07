import { IMessage } from "@/store/chatStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ChatBubbleAvatarProps = {
  message: IMessage;
  isMember: boolean;
  isGroup: boolean | undefined;
};

const ChatBubbleAvatar = ({
  message,
  isMember,
  isGroup,
}: ChatBubbleAvatarProps) => {
  if (!isGroup) return null;

  return (
    <Avatar className="overflow-visible relative">
      {message.sender.isOnline && isMember && (
        <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-foreground" />
      )}
      <AvatarImage
        src={message.sender.image}
        className="rounded-full object-cover h-8 w-8"
      />
      <AvatarFallback className="w-8 h-8">
        <div className="animate-pulse bg-gray-tertiary rounded-full"></div>
      </AvatarFallback>
    </Avatar>
  );
};

export default ChatBubbleAvatar;
