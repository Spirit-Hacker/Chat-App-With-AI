import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chatStore";
import toast from "react-hot-toast";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useComponentVisible from "@/hooks/useComponentVisible";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const sendTextMessage = useMutation(api.messages.sendTextMessages);
  const getMe = useQuery(api.users.getMe);
  const { selectedConversation } = useConversationStore();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const handleSendTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendTextMessage({
        content: msgText,
        sender: getMe!._id,
        conversation: selectedConversation!._id,
      });

      setMsgText("");
    } catch (err: any) {
      toast.error(err.message);
      console.log("Error", err);
    }
  };

  return (
    <div className="bg-gray-primary p-2 flex gap-4 items-center">
      <div className="relative flex gap-2 ml-2">
        {/* EMOJI PICKER WILL GO HERE */}
        <div
          ref={ref}
          onClick={() => setIsComponentVisible(true)}
          className="cursor-pointer"
        >
          {isComponentVisible && (
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                setMsgText((prev) => prev + emojiObject.emoji);
              }}
              theme={Theme.DARK}
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1rem",
                zIndex: "50",
                height: "50vh",
                width: "20vw",
              }}
            />
          )}
          <Laugh className="text-gray-600 dark:text-gray-400" />
        </div>
        <Plus className="text-gray-600 dark:text-gray-400" />
      </div>
      <form className="w-full flex gap-3" onSubmit={handleSendTextMessage}>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message"
            className="py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
        </div>
        <div className="mr-4 flex items-center gap-3">
          {msgText.length > 0 ? (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Send />
            </Button>
          ) : (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Mic />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default MessageInput;
