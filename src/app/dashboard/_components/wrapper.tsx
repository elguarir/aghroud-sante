import { cn } from "@/lib/utils";
import { ScrollAreaProps } from "@radix-ui/react-scroll-area";

const Wrapper = ({ className, children, ...rest }: ScrollAreaProps) => {
  return (
    <>
      <div className="custom-scrollbar mx-auto h-full w-full overflow-y-auto p-6 px-4 py-6 md:px-12 md:py-8">
        <section className={cn("h-fit min-h-full", className)}>
          {children}
        </section>
      </div>
    </>
  );
};

export default Wrapper;
