import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  console.log("2")
  if (!session?.user) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
