import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex flex-1 flex-col p-2 ps-0">{children}</main>
    </div>
  );
}
