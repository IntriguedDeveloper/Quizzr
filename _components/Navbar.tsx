import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-pop",
  weight: "500",
});
export default function Navbar() {
  return (
    <>
      <nav className={`bg-[#0066b2] p-4 text-white text-center`}>
        <h1 className={`text-4xl ${poppins.variable} font-pop`}>Quizzr</h1>
      </nav>
    </>
  );
}
