type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}
interface MealTypeGroups {
  breakfast: IMealItemDoc[];
  lunch: IMealItemDoc[];
  dinner: IMealItemDoc[];
  snack: IMealItemDoc[];
}
interface ChartData {
  name: string;
  value: number;
  fill: string;
}
