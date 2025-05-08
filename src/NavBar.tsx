import { AlignJustify, History, Home, User, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="bg-gray-500 w-full p-5 z-10">
      <div className="flex items-center justify-between">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer md:hidden"
        >
          {!open ? <AlignJustify /> : <X />}
        </div>
      </div>

      <ul
        className={`h-full transition-all ${
          !open ? "w-0" : "w-[200px]"
        } absolute overflow-hidden  bg-gray-500 left-0 flex flex-col pt-10 gap-10 md:w-full md:flex-row md:p-0 md:static md:justify-end`}
      >
        <li className="ml-3">
          <Link
            to="/"
            className="flex gap-3 hover:text-green-400"
            onClick={() => setOpen(false)}
          >
            <Home />
            Home
          </Link>
        </li>
        <li className="ml-3">
          <Link
            to="/profile"
            className="flex gap-3 hover:text-green-400"
            onClick={() => setOpen(false)}
          >
            <User />
            Perfil
          </Link>
        </li>
        <li className="ml-3">
          <Link
            to="/history"
            className="flex gap-3 hover:text-green-400"
            onClick={() => setOpen(false)}
          >
            <History />
            Historia
          </Link>
        </li>
      </ul>
    </div>
  );
}
