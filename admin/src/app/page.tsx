import { AdminLogin } from "./components/AdminLogin";
import { AdminNavBar } from "./components/AdminNavBar";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <AdminNavBar />
      <AdminLogin />
    </div>
  );
}
