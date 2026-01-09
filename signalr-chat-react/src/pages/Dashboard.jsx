import { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { FaUser } from "react-icons/fa"; // For user icon

export default function Dashboard() {
  const [connection, setConnection] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;

  if (!username || !token) window.location.href = "/login";

  // Create SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/chatHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [token]);

  // Start connection + events
  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR (JWT)");

        connection.on("UpdateUserList", (userList) => {
          setUsers(userList.filter((u) => u !== username));
        });

        connection.on("ReceiveMessage", (fromUser, message) => {
          setMessages((prev) => [...prev, { fromUser, message }]);
        });

        connection.invoke("RegisterUser");
      })
      .catch((err) => console.error("SignalR Error:", err));

    return () => connection.stop();
  }, [connection, username]);

  // Load chat history
  useEffect(() => {
    if (!connection || !selectedUser) return;

    const loadHistory = async () => {
      try {
        const history = await connection.invoke("GetChatHistory", selectedUser);
        setMessages(
          history.map((m) => ({
            fromUser: m.fromUser,
            message: m.message,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadHistory();
  }, [connection, selectedUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!text || !selectedUser) return;

    await connection.invoke("SendPrivateMessage", selectedUser, text);
    setMessages((prev) => [...prev, { fromUser: username, message: text }]);
    setText("");
  };

  // Logout
  const handleLogout = async () => {
    try {
      if (connection) await connection.stop();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-purple-100 via-blue-100 to-green-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-500 to-blue-500 shadow-lg rounded-r-xl flex flex-col transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 text-center text-white pt-4">
          Users Online
        </h2>
        <div className="flex-1 overflow-auto px-2 pb-4">
          {users.length === 0 && (
            <div className="text-white text-center mt-4 opacity-80">
              No users online
            </div>
          )}
          {users.map((u) => (
            <div
              key={u}
              onClick={() => {
                setSelectedUser(u);
                setMessages([]);
              }}
              className={`flex items-center gap-2 p-3 mb-2 cursor-pointer rounded-xl transition-all duration-200 transform
                ${selectedUser === u
                  ? "bg-white text-purple-700 shadow-lg scale-105"
                  : "hover:bg-purple-200 hover:text-purple-900 hover:scale-105 text-white"
                }`}
            >
              <FaUser />
              <span className="font-semibold truncate">{u}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white shadow-xl rounded-l-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-tl-xl">
          <h2 className="font-bold text-lg">
            {selectedUser ? `Chat with ${selectedUser}` : "Dashboard"}
          </h2>
        </div>

        {selectedUser ? (
          <>
            <div className="flex-1 p-4 overflow-auto space-y-2 bg-gray-100">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.fromUser === username ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg break-words shadow
                      ${m.fromUser === username
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-300 text-gray-800 rounded-bl-none"
                      }`}
                  >
                    <span className="font-semibold">{m.fromUser}: </span>
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t flex gap-2 bg-gray-50">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a user to start chat
          </div>
        )}
      </div>
    </div>
  );
}
