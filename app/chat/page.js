"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaPaperPlane } from "react-icons/fa";
import { format } from "date-fns";

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [itemId] = useState(searchParams.get("itemId"));
  const messagesEndRef = useRef(null);

  const chatId =
    user && params.userId ? [user.uid, params.userId].sort().join("_") : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !params.userId) return;

    // Fetch other user info
    fetchOtherUser();

    // Subscribe to messages
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, params.userId, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchOtherUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", params.userId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setOtherUser(snapshot.docs[0].data());
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        timestamp: serverTimestamp(),
        itemId: itemId || null,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Please sign in to chat</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {/* Chat Header */}
        <div className="bg-green-600 text-white p-4 flex items-center space-x-3">
          <img
            src={otherUser?.photoURL || "/default-avatar.png"}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{otherUser?.name || "User"}</p>
            <p className="text-sm text-green-100">Active now</p>
          </div>
        </div>

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ height: "calc(100% - 140px)" }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-4xl mb-2">💬</p>
              <p>Start the conversation!</p>
              <p className="text-sm">Send a message to get started</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === user.uid;
              const timestamp = msg.timestamp?.toDate();

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs lg:max-w-md`}>
                    {!isOwn && (
                      <div className="flex items-center space-x-2 mb-1">
                        <img
                          src={msg.senderPhoto || "/default-avatar.png"}
                          alt={msg.senderName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-gray-600">
                          {msg.senderName}
                        </span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {timestamp
                        ? format(timestamp, "MMM d, h:mm a")
                        : "Sending..."}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-3 rounded-full transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
