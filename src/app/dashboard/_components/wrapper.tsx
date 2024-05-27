import { ScrollArea } from "@/components/ui/scrollarea";
import { cn } from "@/lib/utils";
import { ScrollAreaProps } from "@radix-ui/react-scroll-area";

const Wrapper = ({ className, children, ...rest }: ScrollAreaProps) => {
  return (
    <ScrollArea
      className={cn(
        "flex h-[calc(100dvh-56px)] w-full flex-col overflow-y-auto ",
      )}
      {...rest}
    >
      <div
        className={cn(
          "mx-auto h-full min-h-[calc(100dvh-56px)] w-full px-4 py-6 md:px-12 md:py-8",
          className,
        )}
      >
        {children}
      </div>
    </ScrollArea>
  );
};

export default Wrapper;