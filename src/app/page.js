"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SiChatbot } from "/node_modules/react-icons/si";
import { RxCross2 } from "/node_modules/react-icons/rx";
import { IoSendSharp } from "/node_modules/react-icons/io5";
import { FaUser } from "/node_modules/react-icons/fa";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setDateTime(new Date());
    }
  }, [open]);

  const sendMessage = () => {
    const payload = { query: message };
    axios
      .post("https://chatbot.trainright.fit/api/chat", payload)
      .then((res) => setChat(res.data), setMessage(""), setDateTime(new Date()))
      .catch((err) => console.log(err, "Error!"))
      .finally(() => setLoading(false));
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div>
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
        <div className="bg-white fixed bottom-28 right-12 md:h-[510px] md:w-[350px] border border-gray-100 shadow-md rounded-lg">
          <div className="">
            <div>
              <div className="bg-[#006d77] flex justify-start items-center gap-2 w-full p-2 text-white rounded-t-lg">
                <SiChatbot className="w-12 h-12  p-2" />
                <p className="text-xl font-bold">BuilderFloor Chat</p>
              </div>
              <div
                className=" h-[355px] overflow-y-scroll"
                ref={chatContainerRef}
                style={{ scrollBehavior: "smooth" }}
              >
                <p className="bg-[#e5f0f1] text-center rounded-sm py-1 px-3 m-2">
                  Hi, ask your queries here!
                </p>
                {/* {loading && (
                  <p className="bg-[#e5f0f1] text-center rounded-sm py-1 px-3 m-2">
                    Loading...
                  </p>
                )} */}
                {chat?.map((item, index) => (
                  <div
                    className={`flex gap-2 m-2 mb-4 ${
                      item.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                    key={index}
                  >
                    {item.role === "assistant" && (
                      <SiChatbot className="w-5 h-5 text-[#006d77] " />
                    )}
                    <div>
                      <p
                        className={`text-xs mb-1 ${
                          item.role === "assistant" ? "text-left" : "text-right"
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
                        {item.content}
                      </p>
                    </div>
                    {item.role === "user" && (
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
    </div>
  );
}
