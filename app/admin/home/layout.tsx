"use client";
import { useUserContext } from "@/context/UserContext";
import Navbar from "../_components/Navbar";
import Sidebar from "../_components/SideBar";
import { useState } from "react";
import Footer from "../_components/Footer";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const teacherData = useUserContext();

  return (
    <>
      <div>
        <Navbar toggleSidebar={toggleSidebar} teacherDetails = {teacherData}/>
        <Sidebar
          toggleSidebar={toggleSidebar}
          isOpen={isSidebarOpen}
          userName={teacherData.userName}
        ></Sidebar>
        <div className="h-[calc(100vh-80px)] w-full flex flex-row items-start justify-center p-0">{children}</div>
      </div>
      <Footer></Footer>
    </>
  );
}