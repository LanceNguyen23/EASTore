import { Billboard } from "./components/columns";
import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import BillboardClient from "./components/client";

const BillboardsPage = async({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedBillboards: Billboard[] = billboards.map(item => ({id: item.id, label: item.label, createdAt: format(item.createdAt, "MMMM do, yyyy")}))
  return (
    <div className="p-8 pt-6">
      <BillboardClient data={formattedBillboards}/>
    </div>
  );
};

export default BillboardsPage;
