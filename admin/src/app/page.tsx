'use client';
import { useAuth } from "./components/AuthContext";
import { AdminNavBar } from "./components/AdminNavBar";


export default function Home() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="flex justify-center items-center h-screen">
      {isLoggedIn ? <AdminNavBar /> : null}
    </div>
  );
}
