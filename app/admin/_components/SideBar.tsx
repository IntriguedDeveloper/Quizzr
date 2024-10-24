import { AiOutlineClose } from "react-icons/ai";

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-2xl">Menu</h2>
        <button onClick={toggleSidebar} className="text-white text-2xl">
          <AiOutlineClose />
        </button>
      </div>
      <ul className="mt-6">
        <li className="p-4 hover:bg-gray-700 cursor-pointer">
          <a href="#">Dashboard</a>
        </li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">
          <a href="#">Add Quiz</a>
        </li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">
          <a href="#">Analyze Results</a>
        </li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">
          <a href="#">View Classroom</a>
        </li>
      </ul>
    </div>
  );
}
