"use client";
import { useState, useEffect } from "react";
import { SiChatbot } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";
import { IoSendSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [chat, setChat] = useState([
    { msg: "Hi! How can I help you?", isBotChat: true },
  ]);

  useEffect(() => {
    if (open) {
      setDateTime(new Date());
    }
  }, [open]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newUserMessage = { msg: message, isBotChat: false };
      const newBotMessage = {
        msg: "Sorry, I'm not quite ready! Why don't you browse some properties for now?",
        isBotChat: true,
      };
      setChat([...chat, newUserMessage, newBotMessage]);
      setMessage("");
      setDateTime(new Date());
    }
  };

  return (
    <main>
      <div
        className="bg-[#006d77] w-fit h-fit rounded-full fixed bottom-0 right-0 m-10 cursor-pointer p-1 hover:p-2"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <RxCross2 className="w-12 h-12 text-white p-2" />
        ) : (
          <SiChatbot className="w-12 h-12 text-white p-2" />
        )}
      </div>
      {open && (
        <div className="fixed bottom-28 right-12 md:h-[510px] md:w-[350px] border border-gray-100 shadow-md rounded-lg">
          <div className="">
            <div>
              <div className="bg-[#006d77] flex justify-start items-center gap-2 w-full p-2 text-white rounded-t-lg">
                <SiChatbot className="w-12 h-12  p-2" />
                <p className="text-xl font-bold">BuilderFloor Chat</p>
              </div>
              <div className=" h-[355px] overflow-y-scroll">
                {chat.map((item, index) => (
                  <div
                    className={`flex gap-2 m-2 mb-4 ${
                      item.isBotChat ? "justify-start" : "justify-end"
                    }`}
                    key={index}
                  >
                    {item.isBotChat && (
                      <SiChatbot className="w-5 h-5 text-[#006d77] " />
                    )}
                    <div>
                      <p
                        className={`text-xs mb-1 ${
                          item.isBotChat ? "text-left" : "text-right"
                        }`}
                      >
                        {dateTime.toLocaleDateString()}
                        {", "}
                        {dateTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="bg-[#e5f0f1] rounded-sm py-1 px-3 text-wrap max-w-56">
                        {item.msg}
                      </p>
                    </div>
                    {!item.isBotChat && (
                      <FaUser className="w-5 h-5 text-[#006d77] " />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <div className="m-1 flex items-end justify-between">
                <textarea
                  placeholder="Write your query..."
                  className="w-[300px] outline-none bg-[#e5f0f1] rounded-md py-1 px-2"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <IoSendSharp
                  className="w-6 h-6 text-[#006d77] cursor-pointer"
                  onClick={sendMessage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
