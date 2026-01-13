import { ReactNode } from "react";
import { motion } from "framer-motion";
import { poppingTransition } from "./transition";

export default function AnimatedContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={poppingTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`w-full flex flex-col ${className}`}
    >
      <div className="flex-1 overflow-visible lg:overflow-y-auto px-2 pt-4">
        {children}
      </div>
    </motion.div>
  );
}