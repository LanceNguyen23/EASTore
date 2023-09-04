import { Color } from "./components/columns";
import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import ColorClient from "./components/client";

const ColorsPage = async({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedColors: Color[] = colors.map(item => ({id: item.id, name: item.name, value: item.value, createdAt: format(item.createdAt, "MMMM do, yyyy")}))
  return (
    <div className="p-8 pt-6">
      <ColorClient data={formattedColors}/>
    </div>
  );
};

export default ColorsPage;
