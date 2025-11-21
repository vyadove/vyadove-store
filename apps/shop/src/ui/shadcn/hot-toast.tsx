"use client";

import { Toaster as HotToaster, toast, useToaster,  } from "react-hot-toast";

import { useTheme } from "next-themes";

type ToasterProps = React.ComponentProps<typeof HotToaster>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return <HotToaster {...props} />;
};

export { Toaster, toast, useToaster };
