import { ObjectId } from "mongodb";
import Heading from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import ColorForm from "./components/color-form";
import { Separator } from "@/components/ui/separator";


const ColorPage = async ({
  params,
}: {
  params: { colorId: string };
}) => {
  const isCreateColor = params.colorId === "new";
  const title = isCreateColor ? "Create color" : "Edit color";
  const desc = isCreateColor ? "Add a new color" : "Edit a color";

  const objectId =  !isCreateColor ? new ObjectId(params.colorId).toString() : ""
  const color = !isCreateColor ? (await prismadb.color.findUnique({
    where: {
      id: objectId,
    },
  })) : (null);

  return (
    <div className="p-8 pt-6 flex flex-col gap-4">
      <Heading title={title} desc={desc} />
      <Separator />
      <ColorForm data={color} />
    </div>
  );
};

export default ColorPage;
