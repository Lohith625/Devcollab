import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import socket from "../socket/socket";
import { createSnippet } from "../api/snippetApi";
import { joinRoom } from "../api/roomApi";
import { getSnippets } from "../api/snippetApi";
import { runCode } from "../api/codeApi";

function Room() {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Start coding here...");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [users, setUsers] = useState([]);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");


  const handleRunCode = async () => {

    try {
  
      const result = await runCode(code, language);
  
      const output =
        result?.run?.stdout ||
        result?.run?.stderr ||
        "No output";
  
      setOutput(output);
  
    } catch (error) {
  
      console.log(error);
      setOutput("Error running code");
  
    }
  };

  const saveSnippet = async () => {
    try {
      const token = localStorage.getItem("token");
  
      await createSnippet(
        {
          roomId: roomId,
          code : code,
          language: "javascript"
        },
      token
      );
  
      alert("Snippet saved");
  
    } catch (error) {
      console.log(error);
      alert("Failed to save snippet");
    }
  };

  useEffect(() => {

    socket.on("roomUsers", (users) => {
      setUsers(users);
    });

    const join = async () => {
      try {
  
        const token = localStorage.getItem("token");
  
        await joinRoom(roomId, token);
  
      } catch (error) {
        console.log("Join room error:", error);
      }
    };

    const loadSnippets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getSnippets(roomId, token);
        setSnippets(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    
    loadSnippets();
  
    join();
  
    const username = localStorage.getItem("username");
    socket.emit("joinRoom", {
       roomId,
       username
  });
  
    socket.on("receiveCode", (newCode) => {
      setCode(newCode);
    });
  
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  
    return () => {
      socket.off("receiveCode");
      socket.off("receiveMessage");
    };
  
  }, [roomId]);

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("codeChange", { roomId, code: value });
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const username = "User";

    socket.emit("sendMessage", {
      roomId,
      message,
      username,
      userId: "temp"
    });

    setMessage("");
  };
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room link copied!");
  };

  return (
    <div className="room-page">
      <header className="room-header">
        <div className="room-header-main">
          <div className="brand-mark" />
          <div>
            <div className="pill">
              <span className="pill-dot" />
              Live room
            </div>
            <div className="room-title">Room: {roomId}</div>
          </div>
        </div>

        <div className="room-header-right">
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <button type="button" onClick={handleRunCode}>
            ▶ Run code
          </button>
          <button type="button" onClick={saveSnippet}>
            Save snippet
          </button>
        </div>
      </header>

      <main className="room-main">
        <section className="room-editor-pane">
          <div className="room-editor-shell">
            <Editor
              height="70vh"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                smoothScrolling: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <div>
            <div className="pill">Execution output</div>
            <pre className="room-output">
              {output || "// Run code to see output here"}
            </pre>
          </div>
        </section>

        <aside className="room-sidebar">
          <div className="room-sidebar-header">
            <h3 className="room-sidebar-title">Chat</h3>
            <button type="button" onClick={copyLink}>
              Copy invite link
            </button>
          </div>

          <div className="room-chat-log">
            {messages.map((msg, index) => (
              <p key={index}>
                <b>{msg.username}</b>: {msg.message}
              </p>
            ))}
          </div>

          <div className="room-snippets">
            {snippets.map((snippet) => (
              <button
                key={snippet._id}
                type="button"
                onClick={() => setCode(snippet.code)}
              >
                {new Date(snippet.createdAt).toLocaleString()}
              </button>
            ))}
          </div>

          <div className="room-users">
            <strong>Active users</strong>
            {users.map((user, index) => (
              <div key={index}>{user}</div>
            ))}
          </div>

          <div className="room-chat-input-row">
            <input
              className="room-chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message…"
            />
            <button type="button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Room;