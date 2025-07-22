import { redirect } from "next/navigation";
import { format } from "date-fns";

export default function MealsIndex({ params }: { params: { id: string } }) {
  const today = format(new Date(), "dd-MM-yyyy");
  redirect(`/${params.id}/meals/${today}`);
}
