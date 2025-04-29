

import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/user.context";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import Markdown from "markdown-to-jsx";
import hljs from 'highlight.js';



function SyntaxHighlightedCode(props) {
  const ref = useRef(null)

  React.useEffect(() => {
      if (ref.current && props.className?.includes('lang-') && window.hljs) {
          window.hljs.highlightElement(ref.current)

          // hljs won't reprocess the element unless this attribute is removed
          ref.current.removeAttribute('data-highlighted')
      }
  }, [ props.className, props.children ])

  return <code {...props} ref={ref} />
}


const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State for messages
  const [users, setUsers] = useState([]);
  const [fileTree, setFileTree] = useState({
    "app.js":{
      content:`const express = require('express');`
    },
    "package.json":{
      content:`{
        "name": "temp-server",
       
      }`
    }
  });

  const [currentFile , setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([])

  const { user } = useContext(UserContext);
  const messageBox = useRef(null);


  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };

  const addCollaborators = () => {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const send = () => {
    if (!message.trim()) return; // Prevent sending empty messages

    const outgoingMessage = {
      message,
      sender: user,
    };

    sendMessage("project-message", outgoingMessage);

    setMessages((prevMessages) => [...prevMessages, outgoingMessage]); // Add message to state
    setMessage(""); // Clear input field
  };

  function WriteAiMessage(message) {
    try {
      const messageObject = JSON.parse(message);
      return (
        <div className='overflow-auto bg-slate-950 text-white rounded-sm p-2'>
          <Markdown
            children={messageObject.text}
            options={{
              overrides: {
                code: SyntaxHighlightedCode,
              },
            }}
          />
        </div>
      );
    } catch (error) {
      console.error("Error parsing AI message:", error);
      return <div>Error displaying AI message</div>;
    }
  }

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]); // Add received message to state
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project);
        setProject(res.data.project);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight; // Scroll to bottom when messages update
    }
  }, [messages]);

  return (
    <main className="h-screen width-screen flex">
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
          <button onClick={() => setIsModalOpen(true)} className="flex gap-2">
            <i className="ri-add-fill mr-1"></i>
            <p>Add Collaborator</p>
          </button>

          <button onClick={() => setIsSidePanelOpen(true)} className="p-2">
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area pt-16 pb-10 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBox}
            className="message-box p-1 flex-grow flex flex-col gap-2 overflow-auto max-h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scroll-smooth"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message max-w-80 flex flex-col p-2 w-fit rounded-md ${
                  msg.sender.email === user.email
                    ? "ml-auto bg-blue-100"
                    : "bg-slate-50"
                }`}
              >
                <small className="opacity-65 text-xs">{msg.sender.email}</small>
                
                  {msg.sender._id === "ai" ? 
                  
               ( WriteAiMessage(msg.message) )
                   : (
                    msg.message
                )}

              </div>
            ))}
          </div>
          <div className="inputField w-full flex bg-amber-50 absolute bottom-0">
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send} className="px-4 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-100 p- absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center px-4 p-2 bg-slate-200 ">
            <h1 className="font-semibold ">Collaborators</h1>

            <button onClick={() => setIsSidePanelOpen(false)} className="p-2">
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2">
            {project.users &&
              project.users.map((user) => (
                <div
                  key={user._id}
                  className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center bg-slate-50 rounded-md"
                >
                  <div className="aspect-circle w-fit h-fit flex items-center justify-center rounded-full p-4 bg-slate-600 text-white">
                    <i className="ri-user-fill absolute"></i>
                  </div>

                  <h1 className="font-semibold">{user.email}</h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="right flex-grow bg-red-50 h-full flex">

        <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
          <div className="file-tree w-full bg-slate-300 hover:bg-slate-300">
            {
              Object.keys(fileTree).map((file, index)=>(
                <button
                onClick={()=>{setCurrentFile(file)
                  setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                }}
                className="tree-element cursor-pointer p-2 px-4 flex">
                  <p
                  className="font-semibold text-sm ">
                    {file}
                  </p>
                </button>
              ))
            }
          </div>
        </div>

        <div className="code-editor flex flex-col flex-grow h-full shrink">

          <div className="top flex justify-between w-full">
            <div className="files flex">
            {
              openFiles.map((file,index )=>(
                <button
                onClick = {() => setCurrentFile(file)}
                className={`open-file cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''} `}>
                  <p className="text-sm font-semibold ">{file}</p>
                </button>
              ))
            }
            </div>
          </div>

          <div className="bottom flex flex-grow">
            {
              fileTree[currentFile] && (
                <textarea
                value={fileTree[currentFile].content}
                onChange={(e)=>{
                  setFileTree({
                    ...fileTree,
                    [currentFile]: {
                      content: e.target.value
                    }
                  })
                }}
                className="w-full h-full p-4 bg-slate-100 outline-none border-none">

                </textarea>
              )

            }
          </div>

        </div>

      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm p-6">
            <h2 className="text-lg font-bold mb-4">Select a User</h2>
            <ul className="space-y-2 max-h-96 overflow-auto">
              {users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className={`p-2 bg-gray-100 rounded-md hover:bg-gray-200 ${
                    selectedUserId.has(user._id) ? "bg-gray-200" : ""
                  } cursor-pointer flex gap-2`}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-4 bg-slate-600 text-white">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1>{user.email}</h1>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
              <button
                onClick={addCollaborators}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;