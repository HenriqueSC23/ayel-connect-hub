import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  maxWidthClass?: string;
  contentClassName?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  maxWidthClass = "max-w-5xl",
  contentClassName,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="md:pl-64 pt-16 md:pt-6">
        <div className={cn("w-full px-4 pb-10 mx-auto", maxWidthClass, contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};
