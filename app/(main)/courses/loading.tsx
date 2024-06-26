import { Loader } from "lucide-react";
const Loading = () => {
  //đơn giản là tạo icon loading biểu thị
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
    </div>
  );
};

export default Loading;
