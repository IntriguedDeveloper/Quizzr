import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="h-20 bg-white border-b-2 flex justify-center items-center">
        <h1 className="text-4xl text-blue-600 font-extrabold mb-3 mt-3">
          Quizzr
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex-grow flex justify-center items-start">{children}</div>
    </div>
  );
}
	