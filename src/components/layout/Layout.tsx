
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import HelpChatbot from "../chat/HelpChatbot";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <div
          className="flex-1 overflow-y-auto px-4 pb-6 pt-6 md:ml-64"
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          <Outlet />
        </div>
      </div>
      <HelpChatbot />
    </div>
  );
};

export default Layout;
