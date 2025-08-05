import { format } from "date-fns";
import { redirect } from "next/navigation";

const DashBoardInit = ({ params }: { params: { id: string } }) => {
  const today = format(new Date(), "yyyy-MM-dd");
  redirect(`/${params.id}/dashboard/${today}`);
};

export default DashBoardInit;
