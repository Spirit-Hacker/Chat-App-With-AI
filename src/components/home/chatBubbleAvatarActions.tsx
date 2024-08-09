import { IMessage, useConversationStore } from "@/store/chatStore";
import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";

type ChatBubbleAvatarActionsProps = {
  message: IMessage;
  me: any;
};

const ChatBubbleAvatarActions = ({
  message,
  me,
}: ChatBubbleAvatarActionsProps) => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  const isMember = selectedConversation?.participants.includes(
    message.sender._id
  );
  const kickUser = useMutation(api.conversations.kickUser);
  const createConversation = useMutation(api.conversations.createConversations);

  const handleKickUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedConversation) return;
    try {
      await kickUser({
        conversationId: selectedConversation!._id,
        userId: message.sender._id,
      });

      setSelectedConversation({
        ...selectedConversation,
        participants: selectedConversation.participants.filter(
          (id) => id !== message.sender._id
        ),
      });
    } catch (error) {
      toast.error("Failed to kick user");
      console.log(error);
    }
  };

  const handleCreateConversation = async () => {
    try {
      const conversationId = await createConversation({
        participants: [me._id, message.sender._id],
        isGroup: false,
      });

      setSelectedConversation({
        _id: conversationId,
        name: message.sender.name,
        participants: [me._id, message.sender._id],
        isGroup: false,
        isOnline: message.sender.isOnline,
        image: message.sender.image,
      });
    } catch (error) {
      toast.error("Failed to create conversation");
      console.log(error);
    }
  };

  return (
    <div
      className="text-[11px] flex gap-4 justify-between font-bold cursor-pointer group"
      onClick={handleCreateConversation}
    >
      {message.sender.name}
      {!isMember && <Ban size={18} className="text-red-500" />}
      {isMember && selectedConversation?.admin === me._id && (
        <LogOut
          size={18}
          className="text-red-500 opacity-0 group-hover:opacity-100"
          onClick={handleKickUser}
        />
      )}
    </div>
  );
};

export default ChatBubbleAvatarActions;
