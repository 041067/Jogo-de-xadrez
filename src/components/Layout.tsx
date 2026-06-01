import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-black overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
