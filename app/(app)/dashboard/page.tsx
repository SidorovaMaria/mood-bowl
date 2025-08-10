import { format } from "date-fns";
import { redirect } from "next/navigation";

const DashBoardInit = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  redirect(`/dashboard/${today}`);
};

export default DashBoardInit;
