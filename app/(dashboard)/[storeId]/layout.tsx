import MainNav from "@/components/main-nav";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DashboardLayout = async({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {

  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/sign-in");
  }
  console.log("3")
  return (
    <div className=" h-screen">
      <MainNav />
      {children}
    </div>
  );
};

export default DashboardLayout;
