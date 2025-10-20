"use client";

import React, {
  type PropsWithChildren, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from "react";

import { twMerge } from "tailwind-merge";

import { generatePath } from "@/components/inverted-corner-mask/utils";

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

  const pathRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cornerContentRef = useRef<HTMLDivElement>(null);

  const roundedCorner = useMemo(() => {
    const invertedCornerKey = Object.keys(props.invertedCorners).find(
      (key) => props.invertedCorners[key as keyof InvertedCorners]?.inverted,
    );

    if (!invertedCornerKey) return null;

    return invertedCornerKey as CornerKey;
  }, [props.invertedCorners]);

  useEffect(() => {
    if (!location.search) return;

    // setCornerRadius(getInitialCornerRadius());
    // setInvertedCorners(getInitialInvertedCornersValues());
  }, []);

  useLayoutEffect(() => {
    setPathCode(
      generatePath(setup, cornerRadius, invertedCorners, {
        x: borderWidth,
        y: borderWidth,
      }),
    );
  }, [setup, cornerRadius, invertedCorners, borderWidth, props]);

  // ADJUST SIZE BASED ON CONTAINER
  useLayoutEffect(() => {
    // set the setup based on the container size
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();

    setSetup({
      width: width - DEFAULT_BORDER_WIDTH,
      height: height - DEFAULT_BORDER_WIDTH,
      lockAspectRatio: 2,
    });
  }, [props]);

  useLayoutEffect(() => {
    if (!cornerContentRef.current) return;

    const contentRect = cornerContentRef.current.getBoundingClientRect();
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
            width: contentRect.width,
            height: contentRect.height,
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
  }, [props]);

  return (
    <div
      className={twMerge("relative", props.containerProps?.className)}
      ref={containerRef}
    >
      <div
        className={twMerge(
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

      {/*<rect width="700" height="700" fill="url(#ffflux-gradient)" filter="url(#ffflux-filter)"></rect>*/}
      <div
        className={twMerge("bg-green-50", props.className)}
        style={{
          clipPath: 'path("' + pathCode + '")',
        }}
      >
        {props?.children}
      </div>

      {/*  --- SVG MASK --- */}
      <svg
        className="absolute -z-10 hidden h-full w-full overflow-visible"
        height="100%"
        id="preview"
        viewBox={`0 0 ${setup.width + borderWidth * 2} ${setup.height + borderWidth * 2}`}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        // fill={backgroundColor}
        {...props?.maskProps}
      >
        {/*<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 700 700" width="700" height="700"></svg>*/}

        <path
          d={pathCode}
          ref={pathRef}
          // fill="url(#ffflux-gradient)"
          // filter="url(#ffflux-filter)"
        />
      </svg>
    </div>
  );
};

export default InvertedCornerMask;
