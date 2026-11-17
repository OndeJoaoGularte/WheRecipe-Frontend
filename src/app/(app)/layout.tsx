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
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 lg:flex lg:flex-col lg:overflow-hidden">
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
