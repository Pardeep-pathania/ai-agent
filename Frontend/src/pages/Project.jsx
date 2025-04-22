import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // console.log(location.state)

  return (
    <main className="h-screen width-screen flex">
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100">

          <button className="flex gap-2">
            <i className="ri-add-fill mr-1"></i>
            <p>Add Collaborator</p>
          </button>

          <button onClick={() => setIsSidePanelOpen(true)} className="p-2">
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex-grow flex flex-col">
          <div className="message-box p-1 flex-grow flex flex-col gap-2">
            <div className=" message max-w-56 flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">Lorem ipsum dolor sit amet.</p>
            </div>

            <div className="message max-w-56 ml-auto flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">Lorem ipsum dolor sit amet.</p>
            </div>
          </div>

          <div className="inputField w-full flex bg-amber-50">
            <input
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button className="px-4  bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-100 p- absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-end px-4 p-2 bg-slate-200 ">
            <button onClick={() => setIsSidePanelOpen(false)} className="p-2">
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2">
            <div className="user cursor-opointer hover:bg-slate-200 p-2 flex gap-2 items-center bg-slate-50 rounded-md">
              <div className="aspect-circle w-fit h-fit flex items-center justify-center rounded-full p-4 bg-slate-600 text-white">
                <i className="ri-user-fill absolute"></i>
              </div>

              <h1 className="font-semibold">username</h1>
            </div>
          </div>
        </div>
      </section>

            

    </main>
  );
};

export default Project;
