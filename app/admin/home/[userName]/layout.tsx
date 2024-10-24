"use client";
import Navbar from "../../_components/Navbar";
import Sidebar from "../../_components/SideBar";
import { useState } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <div>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen}></Sidebar>
        <main >{children}</main>
      </div>
    </>
  );
}
