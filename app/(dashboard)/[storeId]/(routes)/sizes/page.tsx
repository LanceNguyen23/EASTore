import { Size } from "./components/columns";
import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import SizeClient from "./components/client";

const SizesPage = async({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedSizes: Size[] = sizes.map(item => ({id: item.id, name: item.name, value: item.value, createdAt: format(item.createdAt, "MMMM do, yyyy")}))
  return (
    <div className="p-8 pt-6">
      <SizeClient data={formattedSizes}/>
    </div>
  );
};

export default SizesPage;
