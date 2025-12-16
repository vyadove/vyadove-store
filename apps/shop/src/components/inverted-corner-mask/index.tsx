"use client";

import React, {
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useMeasure } from "react-use";

import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

import { generatePath } from "@/components/inverted-corner-mask/utils";

import { cn } from "@/lib/utils";

export const DEFAULT_SETUP = {
  width: 200,
  height: 100,
  lockAspectRatio: null,
} as Setup;

export const DEFAULT_BORDER_WIDTH = 0;
export const DEFAULT_BORDER_COLOR = "#" + "FF2056";
export const DEFAULT_BACKGROUND_COLOR = "#" + "513D34";
export const DEFAULT_CORNER_RADIUS = {
  tl: 16,
  tr: 16,
  br: 16,
  bl: 16,
} as CornerRadius;

// prettier-ignore
export const DEFAULT_INVERTED_CORNERS = {
	tl: { width: 20, height: 20, roundness: 10, inverted: false, corners: [10, 10, 10] },
	tr: { width: 20, height: 20, roundness: 10, inverted: false, corners: [10, 10, 10] },
	br: { width: 20, height: 20, roundness: 10, inverted: false, corners: [10, 10, 10] },
	bl: { width: 20, height: 20, roundness: 10, inverted: false, corners: [10, 10, 10] },
} as InvertedCorners;

export const getInitialCornerRadius = () => {
  return DEFAULT_CORNER_RADIUS;
};

export type Props = {
  cornerContent?: React.ReactNode;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  invertedCorners: InvertedCorners;
  cornersRadius?: number;
  maskProps?: React.SVGProps<SVGSVGElement>;
} & React.HTMLAttributes<HTMLDivElement>;

const InvertedCornerMask = (props: PropsWithChildren<Props>) => {
  const [setup, setSetup] = useState(DEFAULT_SETUP);
  const [cornerRadius] = useState(DEFAULT_CORNER_RADIUS);
  const [invertedCorners, setInvertedCorners] = useState({
    ...DEFAULT_INVERTED_CORNERS,
    ...props.invertedCorners,
  });
  const [borderWidth] = useState(0);
  const [pathCode, setPathCode] = useState("");

  const [ref, measure] = useMeasure<HTMLDivElement>();
  const [cornerContentRef, cornerContentMeasure] = useMeasure<HTMLDivElement>();

  const roundedCorner = useMemo(() => {
    const invertedCornerKey = Object.keys(props.invertedCorners).find(
      (key) => props.invertedCorners[key as keyof InvertedCorners]?.inverted,
    );

    if (!invertedCornerKey) return null;

    return invertedCornerKey as CornerKey;
  }, [props.invertedCorners]);

  // CORNER CONTENT RADIUS
  useLayoutEffect(() => {
    const invertedCornerKey = (
      Object.keys(props.invertedCorners) as CornerKey[]
    )
      .filter(
        (key) => props.invertedCorners[key as keyof InvertedCorners]?.inverted,
      )
      .map((key) => {
        return {
          [key]: {
            ...DEFAULT_INVERTED_CORNERS[key as keyof InvertedCorners],
            width: cornerContentMeasure.width,
            height: cornerContentMeasure.height,
            roundness: props.cornersRadius,
            roundedContent:
              props.invertedCorners[key as keyof InvertedCorners]
                ?.roundedContent,
            corners: [
              props.cornersRadius,
              props.cornersRadius,
              props.cornersRadius,
            ],
            inverted: true,
          },
        };
      });

    const newInvertedCorners = {
      ...DEFAULT_INVERTED_CORNERS,
      ...invertedCornerKey.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };

    setInvertedCorners(newInvertedCorners);
  }, [props, cornerContentMeasure]);

  useLayoutEffect(() => {
    setPathCode(
      generatePath(
        {
          width: measure?.width - DEFAULT_BORDER_WIDTH,
          height: measure?.height - DEFAULT_BORDER_WIDTH,
          lockAspectRatio: 2,
        },
        cornerRadius,
        invertedCorners,
        {
          x: borderWidth,
          y: borderWidth,
        },
      ),
    );
  }, [setup, cornerRadius, invertedCorners, borderWidth, props, measure]);

  return (
    <div
      ref={ref}
      {...props.containerProps}
      className={cn("relative", props.containerProps?.className)}
    >
      <div
        className={cn(
          "absolute z-20",
          roundedCorner === "tr" &&
            `top-0 right-0 rounded-bl-[${props.cornersRadius}px]`,
          roundedCorner === "tl" &&
            `top-0 left-0 rounded-br-[${props.cornersRadius}px]`,
          roundedCorner === "br" &&
            `right-0 bottom-0 rounded-tl-[${props.cornersRadius}px]`,
          roundedCorner === "bl" &&
            `bottom-0 left-0 rounded-tr-[${props.cornersRadius}px]`,
        )}
        ref={cornerContentRef}
      >
        {props?.cornerContent || <div className="size-8" />}
      </div>

      <motion.div
        className={cn("bg-primary-background", props.className)}
        // ref={ref as any}
        style={{
          clipPath: 'path("' + pathCode + '")',
        }}
      >
        {props?.children}
      </motion.div>
    </div>
  );
};

export default InvertedCornerMask;
