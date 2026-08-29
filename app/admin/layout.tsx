import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      <AdminNavbar />
      <main className="pt-28 px-4 sm:px-6">{children}</main>
    </div>
  );
}