import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function Loading({ className, size = "default" }: LoadingProps) {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div
        className="
          relative h-[300px] w-[100px] 
          rotate-90 overflow-hidden 
          rounded-t-full bg-transparent
          [box-shadow:0_0_200px_#960000,inset_0_0_200px_#960000]
          animate-[party_8s_cubic-bezier(.87,-.41,.19,1.44)_infinite_0s]
        "
      >
        <div
          className="
            relative flex h-full w-full 
            items-center self-end
            animate-[load_8s_ease-in_infinite_0s]
            before:content-['']
            before:absolute before:bottom-0 before:left-0
            before:h-[calc(90%-50px)] before:w-1/4
            before:bg-[#960000]
            before:transition-all before:duration-1000
            after:content-['']
            after:absolute after:bottom-0 after:right-1/2 after:translate-x-1/2
            after:h-[90%] after:w-1/2
            after:rounded-t-[50px]
            after:bg-[#960000]
          "
          style={{
            background:
              "repeating-linear-gradient(45deg, #FFFFEE, #FFFFEE 15px, #D33144 15px, #D33144 30px)",
          }}
        />
      </div>
    </div>
  );
}
