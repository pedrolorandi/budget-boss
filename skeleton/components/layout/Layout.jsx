import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="flex container">
        <Sidebar />
        <main className="flex flex-col p-5">{children}</main>
      </div>
    </div>
  );
}
