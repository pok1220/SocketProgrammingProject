import Image from "next/image";
import Button from "./components/ButtonLogin";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex bg-blue-200 justify-center items-center min-h-screen">
      <div className="flex flex-col items-center sm:w-[70%] w-full my-12 px-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Click to Chat</h1>
        <Button className=""><Link href={"/mainpage"}>Start Send Message</Link></Button>
      </div>
    </div>
  );
}
