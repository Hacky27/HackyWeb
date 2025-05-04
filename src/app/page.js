import { Signinmodal } from "@/components/ui/signinmodal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center bg-black text-white"
      style={{ backgroundImage: "url('./hackbg.jpg')" }}
    >
      <div className=" fixed px-4 top-0 bg-black flex flex-row w-full items-center justify-between text-sm text-gray-200" >

        <div className=" py-3">
          <Link href="#">
            <Image
              width={200}
              height={100}
              src="/logos1.jpg"
              alt="Logo"
              className="md:h-[60px]  ml-3"
            />
          </Link>{" "}
        </div>
        <div className="md:flex"><p className="text-xs md:text-sm ">Powered by
        </p>
          <h3 className="md:text-2xl underline text-[#0DB79F]">
            HACKY SECURITY
          </h3>
        </div>
      </div>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">
          Welcome to the Hacky Security Lab Portal!
        </h1>
        <p className="text-lg italic ">Please sign in to access your account</p>
      </header>

      <div className="flex space-x-4">
        <Signinmodal />

      </div>


      <footer className="mt-12 p-4 fixed bottom-0 bg-customDark flex flex-col sm:flex-row w-full items-center justify-center text-sm text-gray-200">
        <p>2025 © Hacky Security</p>
        {/* <div className="flex space-x-4 ">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Purchase Lab</a>
        </div> */}
      </footer>
    </div>
  );
}
