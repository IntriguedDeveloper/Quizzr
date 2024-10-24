import React from "react";


import Navbar from "@/app/admin/_components/Navbar";



interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
     <Navbar></Navbar>
      <main className="flex-1 flex justify-center items-center p-8 bg-gradient-to-r from-[#020024] via-[#2c2c57] to-[#00caff]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
