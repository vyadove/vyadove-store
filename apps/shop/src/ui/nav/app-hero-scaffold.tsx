import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { cn } from "@/lib/utils";


import { DesktopNav } from "@ui/nav/desktop-nav";

type Props = {
  containerProps?: ComponentProps<typeof InvertedCornerMask>;
};

const AppHeroScaffold = ({ children, containerProps }: PropsWithChildren<Props>) => {
  return (
    <InvertedCornerMask
      cornerContent={<DesktopNav />}
      cornersRadius={25}
      invertedCorners={{
        tl: { inverted: true, corners: [25, 25, 25] },
      }}
      {...containerProps}
      className={cn(
        "animate-gradient-xy flex w-full bg-linear-95 ",
        "bg-linear-45 from-[rgba(243,224,214,1)] from-20%  to-green-900/50 bg-[length:140%_100%]  h-full",
        containerProps?.className,
      )}
      containerProps={containerProps?.containerProps}
    >
      {children}
    </InvertedCornerMask>
  );
};

export default AppHeroScaffold;
