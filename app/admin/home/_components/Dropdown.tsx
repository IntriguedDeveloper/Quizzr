import React, { useState } from "react";
import CreateClassRoom from "./CreateClassRoom";
import JoinClassRoom from "./JoinClassRoom";
//TODO: test joining functionality
const Dropdown: React.FC<{ refreshClassesSetter: () => void }> = ({
  refreshClassesSetter,
}) => {
  const [joinToggle, setJoinToggle] = useState(false);
  
  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-2/5 animate-wiggle">
      <div className="flex flex-row text-base lg:text-xl w-full justify-center items-center">
        <div
          className={`p-3 flex-1 flex cursor-pointer transition-all duration-100 h-16 justify-center items-center border-l-2 border-b-2 border-t-2 rounded-sm ${
            !joinToggle
              ? "border-2 border-b-4 border-b-blue-600 text-slate-900 font-semibold"
              : "text-slate-500"
          }`}
          onClick={() => setJoinToggle(false)}
        >
          Create Classroom
        </div>
        <div
          className={`p-3 flex-1 flex cursor-pointer transition-all duration-100 h-16 justify-center items-center border-t-2 border-r-2 border-b-2 ${
            joinToggle
              ? "border-2 border-b-4 border-b-blue-600 text-slate-900 font-semibold"
              : "text-slate-500"
          }`}
          onClick={() => setJoinToggle(true)}
        >
          Join Classroom
        </div>
      </div>
      <div className="w-full h-full flex justify-center">
        {joinToggle ? (
          <JoinClassRoom refreshClassesSetter={refreshClassesSetter} />
        ) : (
          <CreateClassRoom refreshClassesSetter={refreshClassesSetter} />
        )}
      </div>
    </div>
  );
};

export default Dropdown;
