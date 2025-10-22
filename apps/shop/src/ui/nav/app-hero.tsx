import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";

import { NavItems } from "@ui/nav/nav";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { cn } from "@/lib/utils";

type Props = {
  containerProps?: ComponentProps<typeof InvertedCornerMask>;
};

const AppHero = ({ children, containerProps }: PropsWithChildren<Props>) => {
  return (
    <InvertedCornerMask
      containerProps={
        {
          // className: 'w-full border-2'
        }
      }
      cornerContent={<NavItems />}
      cornersRadius={25}
      invertedCorners={{
        tl: { inverted: true, corners: [25, 25, 25] },
      }}
      {...containerProps}
      className={cn(
        "animate-gradient-xy flex w-full bg-linear-45 ",
        "from-[rgba(243,224,214,1)] from-20%  to-[#2A4A3A]/30 bg-[length:140%_100%] ",
        containerProps?.className,
      )}
    >
      {children}
    </InvertedCornerMask>
  );
};

export default AppHero;
