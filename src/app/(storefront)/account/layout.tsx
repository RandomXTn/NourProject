import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountNav } from "./account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/login?callbackUrl=/account");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-luxury max-w-6xl">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-light text-ivory">Mon compte</h1>
          <p className="text-stone text-sm mt-1">Bonjour, {session.user.name ?? session.user.email}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AccountNav />
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
