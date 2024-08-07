import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chatStore";
import ChatBubbleAvatar from "./chatBubbleAvatar";
import DateIndicator from "./dateIndicator";

type ChatBubbleProps = {
  message: IMessage;
  me: any;
  previousMessage?: IMessage;
};

const ChatBubble = ({ message, me, previousMessage }: ChatBubbleProps) => {
  const date = new Date(message._creationTime);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const time = `${hour}:${minute}`;

  const { selectedConversation } = useConversationStore();
  const isMember = selectedConversation!.participants.includes(
    message!.sender._id
  );
  const isGroup = selectedConversation?.isGroup;
  const fromMe = message.sender._id === me!._id;
  const bgClass = fromMe ? "bg-green-chat" : "bg-white dark:bg-gray-primary";

  if (!fromMe) {
    return (
      <>
        <DateIndicator message={message} previousMessage={previousMessage} />
        <div className="flex gap-1 w-2/3 mr-auto">
          <ChatBubbleAvatar
            message={message}
            isMember={isMember}
            isGroup={isGroup}
          />
          <div
            className={`flex z-20 mr-auto max-w-fit px-2 py-1 rounded-md shadow-md relative ${bgClass}`}
          >
            <OtherMessageIndicator />
            <TextMessage message={message} />
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
          className={`flex z-20 max-w-fit ml-auto px-2 py-1 rounded-md shadow-md relative ${bgClass}`}
        >
          <SelfMessageIndicator />
          <TextMessage message={message} />
          <MessageTime time={time} fromMe={fromMe} />
        </div>
      </div>
    </>
  );
};

export default ChatBubble;

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
    <div>
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
