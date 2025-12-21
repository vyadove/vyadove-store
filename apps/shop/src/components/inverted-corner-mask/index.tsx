"use client";

import React, {
  type CSSProperties,
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useMeasure } from "react-use";

import { generatePath } from "@/components/inverted-corner-mask/utils";

import { cn } from "@/lib/utils";

const DEFAULT_CORNER_RADIUS: CornerRadius = {
  tl: 16,
  tr: 16,
  br: 16,
  bl: 16,
};

const DEFAULT_INVERTED_CORNER: Omit<InvertedCorner, "content"> = {
  width: 20,
  height: 20,
  inverted: false,
};

const CORNER_STYLES: Record<
  CornerKey,
  { position: CSSProperties; radiusKey: keyof CSSProperties }
> = {
  tr: { position: { top: 0, right: 0 }, radiusKey: "borderBottomLeftRadius" },
  tl: { position: { top: 0, left: 0 }, radiusKey: "borderBottomRightRadius" },
  br: { position: { right: 0, bottom: 0 }, radiusKey: "borderTopLeftRadius" },
  bl: { position: { bottom: 0, left: 0 }, radiusKey: "borderTopRightRadius" },
};

const CORNER_KEYS: CornerKey[] = ["tl", "tr", "br", "bl"];

function deepMergeCorners(
  defaults: Record<CornerKey, InvertedCorner>,
  overrides: InvertedCorners,
): InvertedCorners {
  const result: InvertedCorners = {};

  for (const key of CORNER_KEYS) {
    const override = overrides[key];

    if (override) {
      result[key] = { ...defaults[key], ...override };
    } else {
      result[key] = { ...defaults[key] };
    }
  }

  return result;
}

export type Props = {
  /** @deprecated Use `content` inside invertedCorners config instead */
  cornerContent?: React.ReactNode;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  invertedCorners: InvertedCorners;
  cornersRadius?: number;
  border?: InvertedCornerBorder;
} & React.HTMLAttributes<HTMLDivElement>;

const InvertedCornerMask = (props: PropsWithChildren<Props>) => {
  const {
    invertedCorners: propsInvertedCorners,
    cornersRadius = 16,
    border,
  } = props;

  const [ref, measure] = useMeasure<HTMLDivElement>();
  const [cornerContentRef, cornerContentMeasure] = useMeasure<HTMLDivElement>();

  const defaultCorners = useMemo(
    () =>
      CORNER_KEYS.reduce(
        (acc, key) => {
          acc[key] = { ...DEFAULT_INVERTED_CORNER };

          return acc;
        },
        {} as Record<CornerKey, InvertedCorner>,
      ),
    [],
  );

  const activeCornerKey = useMemo(() => {
    return (
      CORNER_KEYS.find((key) => propsInvertedCorners[key]?.inverted) ?? null
    );
  }, [propsInvertedCorners]);

  const [invertedCorners, setInvertedCorners] = useState<InvertedCorners>(() =>
    deepMergeCorners(defaultCorners, propsInvertedCorners),
  );

  useLayoutEffect(() => {
    if (
      !activeCornerKey ||
      !cornerContentMeasure.width ||
      !cornerContentMeasure.height
    ) {
      // Still do deep merge even without measurements
      setInvertedCorners(
        deepMergeCorners(defaultCorners, propsInvertedCorners),
      );

      return;
    }

    const updatedCorners = CORNER_KEYS.filter(
      (key) => propsInvertedCorners[key]?.inverted,
    ).reduce<InvertedCorners>((acc, key) => {
      const cornerConfig = propsInvertedCorners[key];
      const defaultCornerRadii: [number, number, number] = [
        cornersRadius,
        cornersRadius,
        cornersRadius,
      ];

      acc[key] = {
        ...DEFAULT_INVERTED_CORNER,
        ...cornerConfig,
        width: cornerContentMeasure.width,
        height: cornerContentMeasure.height,
        corners: cornerConfig?.corners ?? defaultCornerRadii,
        inverted: true,
      };

      return acc;
    }, {});

    setInvertedCorners((prev) =>
      deepMergeCorners(defaultCorners, { ...prev, ...updatedCorners }),
    );
  }, [
    activeCornerKey,
    cornerContentMeasure.width,
    cornerContentMeasure.height,
    cornersRadius,
    propsInvertedCorners,
    defaultCorners,
  ]);

  const pathCode = useMemo(() => {
    if (!measure.width || !measure.height) return "";

    return generatePath({
      setup: {
        width: measure.width,
        height: measure.height,
        lockAspectRatio: null,
      },
      cornerRadius: DEFAULT_CORNER_RADIUS,
      invertedCorners,
    });
  }, [measure.width, measure.height, invertedCorners]);

  const borderPathCode = useMemo(() => {
    if (!border || !measure.width || !measure.height) return "";

    // Generate path at (0,0) with same dimensions as content
    // SVG will be positioned to create the outset effect
    return generatePath({
      setup: {
        width: measure.width,
        height: measure.height,
        lockAspectRatio: null,
      },
      cornerRadius: DEFAULT_CORNER_RADIUS,
      invertedCorners,
    });
  }, [border, measure.width, measure.height, invertedCorners]);

  const cornerStyle = useMemo((): CSSProperties | undefined => {
    if (!activeCornerKey) return undefined;
    const { position, radiusKey } = CORNER_STYLES[activeCornerKey];

    return { ...position, [radiusKey]: cornersRadius };
  }, [activeCornerKey, cornersRadius]);

  return (
    <div
      ref={ref}
      {...props.containerProps}
      className={cn(
        "group relative overflow-visible rounded-xl",
        props.containerProps?.className,
      )}
    >
      {/* Border SVG - same shape as content, stroke extends outward */}
      {border && borderPathCode && (
        <svg
          className={cn(
            "pointer-events-none absolute inset-0 z-10 transition-opacity duration-300",
            border.showOnHover && "opacity-0 group-hover:opacity-100",
          )}
          height={measure.height}
          style={{ overflow: "visible" }}
          width={measure.width}
        >
          <path
            d={borderPathCode}
            fill="none"
            stroke={border.color}
            strokeWidth={border.width}
          />
        </svg>
      )}

      {activeCornerKey && (
        <div
          className="absolute z-20"
          ref={cornerContentRef}
          style={cornerStyle}
        >
          {propsInvertedCorners[activeCornerKey]?.content ??
            props.cornerContent ?? <div className="size-8" />}
        </div>
      )}

      <div
        className={cn(
          "relative overflow-hidden bg-primary-background",
          props.className,
        )}
        style={{ clipPath: `path("${pathCode}")` }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default InvertedCornerMask;
