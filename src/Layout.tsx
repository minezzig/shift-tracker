import { Outlet } from "react-router";
import NavBar from "./NavBar";
import { Analytics } from "@vercel/analytics/react"

export default function Layout() {
  return (
    <div className="bg-green-200 flex flex-col min-h-screen">
        <Analytics />
        <aside className="flex">
          <NavBar />
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
    </div>
  );
}
