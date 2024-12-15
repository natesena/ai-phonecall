import { ReactNode } from "react";
import DashboardSideBar from "./_components/dashboard-side-bar";
import DashboardTopNav from "./_components/dashbord-top-nav";
import { isAuthorized } from "@/utils/data/user/isAuthorized";
import { redirect } from "next/dist/server/api-utils";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();
  const { authorized, message } = await isAuthorized(user?.id!);
  if (!authorized) {
    console.log("authorized check fired");
  }
  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed left-0 top-0 bottom-0 w-[280px] border-r bg-background hidden lg:block">
        <DashboardSideBar />
      </div>
      <div className="lg:pl-[280px] overflow-y-auto">
        <div className="fixed top-0 right-0 left-0 lg:left-[280px] z-30 bg-background">
          <DashboardTopNav />
        </div>
        <main className="main mt-[var(--navbar-height)] w-full min-h-[calc(100vh-var(--navbar-height))] overflow-y-auto py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
