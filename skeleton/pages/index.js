import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className="bg-[#FFF] flex flex-col flex-1 rounded-lg p-5">
        <div className="flex flex-row items-center">
          <img src="images/user-icon.png" className="flex h-20" />
          <h1 className="text-4xl ms-5">Hi, Jane!</h1>
        </div>
      </div>
    </>
  );
}
