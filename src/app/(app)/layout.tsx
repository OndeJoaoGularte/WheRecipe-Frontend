import AppNav from "@/components/AppNav";
import AuthGate from "@/components/AuthGate";

export default function AppSectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGate>
      <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
        <AppNav />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </AuthGate>
  );
}
