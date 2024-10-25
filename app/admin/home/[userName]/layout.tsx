"use client";
import { useUserContext } from "@/app/UserContext";
import Navbar from "../../_components/Navbar";
import Sidebar from "../../_components/SideBar";
import { useState } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const teacherData = useUserContext();

  return (
    <>
      <div>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar
          toggleSidebar={toggleSidebar}
          isOpen={isSidebarOpen}
          userName={teacherData.userName}
        ></Sidebar>
        <main>{children}</main>
      </div>
    </>
  );
}
