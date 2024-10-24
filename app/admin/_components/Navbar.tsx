import { Poppins } from "next/font/google";
import { HiMenu } from "react-icons/hi";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-pop",
  weight: "500",
});

export default function Navbar({
  toggleSidebar,
}: {
  toggleSidebar?: () => void; 
}) {
  return (
    <>
      <nav
        className={
          "bg-[#0066b2] p-4 text-white justify-start items-center flex flex-row max-h-20"
        }
      >
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="text-white text-3xl focus:outline-none mr-4"
          >
            <HiMenu />
          </button>
        )}
        <h1 className={`text-4xl ${poppins.variable} font-pop`}>Quizzr</h1>
      </nav>
    </>
  );
}
