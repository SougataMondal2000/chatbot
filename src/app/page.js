"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SiChatbot } from "/node_modules/react-icons/si";
import { RxCross2 } from "/node_modules/react-icons/rx";
import { IoSendSharp } from "/node_modules/react-icons/io5";
import { FaUser } from "/node_modules/react-icons/fa";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { baseurl } from "./baseurl";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default function Home() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [chat_history, setChat_history] = useState([]);

  useEffect(() => {
    if (open) {
      setDateTime(new Date());
    }
  }, [open]);

  const [chat_history, setChat_history] = useState([]);

  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChat(JSON.parse(storedChatHistory));
    }
  }, []);

  useEffect(() => {
    setChat_history(chat);
  }, [chat]);

  const [filterChat, setFilterChat] = useState([]);

  useEffect(() => {
    let conversation = chat;
    console.log(conversation);
    conversation = conversation.filter(
      (obj) => !(obj.message.includes("func") || obj.message.includes("json"))
    );
    setFilterChat(conversation);
  }, [chat]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("chatHistory");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  console.log(chat, "arijit");

  const sendMessage = () => {
    if (!message.trim()) {
      setErrorMessage("Message cannot be empty.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    const payload = {
      message: message,
      chat_history: chat,
    };

    setChat(() => [...chat, { role: "USER", message: message }]);
    let url = `${baseurl}/api/chat`;
    axios
      .post(url, payload)
      .then((res) => {
        let updatedChat = [
          ...chat,
          { role: "USER", message: message },
          { role: "CHATBOT", message: res.data.message },
        ];

        setChat(() => updatedChat);
        localStorage.setItem("chatHistory", JSON.stringify(updatedChat));
        setMessage("");
        setDateTime(new Date());

        if (res.data.message.startsWith("```json")) {
          const jsonResponse = JSON.parse(
            res.data.message.slice(7, -3).replace(/\\n/g, "")
          );

          switch (jsonResponse.func) {
            case "checkRoomAvailable":
              if (jsonResponse.params.length === 3) {
                const checkRoomPayload = {
                  message: `{func_Response: "Tell the user Room is available and Price for this room is 250 usd. Also Ask the user to confirm if we can make the booking?"}
                          Above is the response from the function call. Please respond to the user accordingly.`,
                  chat_history: updatedChat,
                };
                axios
                  .post(url, checkRoomPayload)
                  .then((res) => {
                    updatedChat = [
                      ...updatedChat,
                      { role: "CHATBOT", message: res.data.message },
                    ];
                    setChat(() => updatedChat);
                    localStorage.setItem(
                      "chatHistory",
                      JSON.stringify(updatedChat)
                    );
                  })
                  .catch((err) => console.log(err, "Error!"));
              }
              break;

            // case "phoneno_confirm":
            //   if (jsonResponse.params.length === 4) {
            //     console.log(
            //       typeof jsonResponse.params[0],
            //       jsonResponse.params[0].length,
            //       "de"
            //     );
            //   const missingParamPayload = {
            //     message: "Tell user to provide contact number",
            //     chat_history: updatedChat,
            //   };
            //   axios
            //     .post(
            //       "https://3000-baitech365-chatbot-gaojdb3fd2v.ws-us110.gitpod.io/api/chat",
            //       missingParamPayload
            //     )
            //     .then((res) => {
            //       updatedChat = [
            //         ...updatedChat,
            //         { role: "CHATBOT", message: res.data.message },
            //       ];
            //       setChat(() => updatedChat);
            //       localStorage.setItem(
            //         "chatHistory",
            //         JSON.stringify(updatedChat)
            //       );
            //     })
            //     .catch((err) => console.log(err, "Error!"));
            // }
            //   break;

            // case "book_room_confirm":
            //   if (jsonResponse.params.length === 4) {
            //     console.log(
            //       typeof jsonResponse.params[0],
            //       jsonResponse.params[0].length,
            //       "de"
            //     );
            //     const bookRoomPayload = {
            //       message: `{func_Response: "Tell the user Payment link is sent to his whatsapp. Please confirm once payment is done."}
            //               Above is the response from the function call. Please respond to the user accordingly.`,
            //       chat_history: updatedChat,
            //     };
            //     axios
            //       .post(
            //         "https://3000-baitech365-chatbot-gaojdb3fd2v.ws-us110.gitpod.io/api/chat",
            //         bookRoomPayload
            //       )
            //       .then((res) => {
            //         updatedChat = [
            //           ...updatedChat,
            //           { role: "USER", message: bookRoomPayload.message },
            //           { role: "CHATBOT", message: res.data.message },
            //         ];
            //         setChat(() => updatedChat);
            //         localStorage.setItem(
            //           "chatHistory",
            //           JSON.stringify(updatedChat)
            //         );
            //       })
            //       .catch((err) => console.log(err, "Error!"));
            //   }
            //   break;

            case "book_room_confirm":
              if (jsonResponse.params.length === 4) {
                let bookRoomPayload;

                if (jsonResponse.params[0].length > 10) {
                  const missingParamPayload = {
                    message: "Tell user to provide contact number",
                    chat_history: updatedChat,
                  };
                  axios
                    .post(url, missingParamPayload)
                    .then((res) => {
                      updatedChat = [
                        ...updatedChat,
                        { role: "CHATBOT", message: res.data.message },
                      ];
                      setChat(() => updatedChat);
                      localStorage.setItem(
                        "chatHistory",
                        JSON.stringify(updatedChat)
                      );
                    })
                    .catch((err) => console.log(err, "Error!"));
                }
                if (jsonResponse.params[0].length <= 10) {
                  bookRoomPayload = {
                    message: `{func_Response: "Tell the user Payment link is sent to his whatsapp. Please confirm once payment is done."}
                  Above is the response from the function call. Please respond to the user accordingly.`,
                    chat_history: updatedChat,
                  };

                  axios
                    .post(url, bookRoomPayload)
                    .then((res) => {
                      updatedChat = [
                        ...updatedChat,
                        { role: "CHATBOT", message: res.data.message },
                      ];
                      setChat(() => updatedChat);
                      localStorage.setItem(
                        "chatHistory",
                        JSON.stringify(updatedChat)
                      );
                    })
                    .catch((err) => console.log(err, "Error!"));
                }
              }
              break;

            case "book_room":
              if (jsonResponse.params.length === 4) {
                const bookRoomConfirmPayload = {
                  message: `{func_Response: "Tell the user Payment is completed and room is booked. Is there anything else we can help you with."}
                          Above is the response from the function call. Please respond to the user accordingly.`,
                  chat_history: updatedChat,
                };
                axios
                  .post(url, bookRoomConfirmPayload)
                  .then((res) => {
                    updatedChat = [
                      ...updatedChat,
                      { role: "CHATBOT", message: res.data.message },
                    ];
                    setChat(() => updatedChat);
                    localStorage.setItem(
                      "chatHistory",
                      JSON.stringify(updatedChat)
                    );
                  })
                  .catch((err) => console.log(err, "Error!"));
              }
              break;
            default:
              break;
          }
        }
        setLoading(false);
      })
      .catch((err) => console.log(err, "Error!"))
      .finally(() => setLoading(false));
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [filterChat]);

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
                <p className="text-xl font-bold">ChatBot</p>
              </div>
              <div
                className=" h-[355px] overflow-y-scroll"
                ref={chatContainerRef}
                style={{ scrollBehavior: "smooth" }}
              >
                <p className="bg-[#e5f0f1] text-center rounded-sm py-1 px-3 m-2">
                  Hi, ask your queries here!
                </p>
                {filterChat?.map((item, index) => (
                  <div
                    className={`flex gap-2 m-2 mb-4 ${
                      item.role === "CHATBOT" ? "justify-start" : "justify-end"
                    }`}
                    key={index}
                  >
                    {item.role === "CHATBOT" && (
                      <SiChatbot className="w-5 h-5 text-[#006d77] " />
                    )}
                    <div>
                      <p
                        className={`text-xs mb-1 ${
                          item.role === "CHATBOT" ? "text-left" : "text-right"
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
                        {item.message.replace("how can i assist you?", "")}
                      </p>
                    </div>
                    {item.role === "USER" && (
                      <FaUser className="w-5 h-5 text-[#006d77] " />
                    )}
                  </div>
                ))}
{errorMessage && (
                  <p className="text-red-500 text-center">{errorMessage}</p>
                )}
              </div>
            </div>
            <div className="">
              <div className="m-1 flex items-end justify-between">
                <textarea
                  placeholder="Write your query..."
                  className="w-[300px] outline-none bg-[#e5f0f1] rounded-md py-1 px-2 resize-none"
                  rows={3}
                  value={!loading ? message : ""}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {!loading ? (
                  <IoSendSharp
                    className="w-6 h-6 text-[#006d77] cursor-pointer"
                    onClick={sendMessage}
                  />
                ) : (
                  <ClipLoader
                    color={"#006d77"}
                    loading={true}
                    css={override}
                    size={35}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
