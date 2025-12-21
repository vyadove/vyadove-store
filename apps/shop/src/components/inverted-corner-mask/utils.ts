type ArcParams = { r: number; x: number; y: number; sweep?: number };
const A = ({ r, x, y, sweep = 1 }: ArcParams) =>
  `A${r},${r} 0,0,${sweep} ${x},${y}`;
const H = (x: number) => `H${x}`;
const V = (y: number) => `V${y}`;
const M = (x: number, y: number) => `M${x},${y}`;

type InvertedCornerParams = {
  width: number;
  height: number;
  corners: [number, number, number];
};

function drawInvertedCorner(
  { width, height, corners }: InvertedCornerParams,
  origin: { x: number; y: number },
  direction: CornerKey,
): string {
  const [c0, c1, c2] = corners;
  const { x, y } = origin;

  switch (direction) {
    case "tr":
      return (
        A({ r: c0, x, y: y + c0 }) +
        V(y + height - c1) +
        A({ r: c1, x: x + c1, y: y + height, sweep: 0 }) +
        H(x + width - c2) +
        A({ r: c2, x: x + width, y: y + height + c2 })
      );

    case "br":
      return (
        A({ r: c0, x: x - c0, y }) +
        H(x - width + c1) +
        A({ r: c1, x: x - width, y: y + c1, sweep: 0 }) +
        V(y + height - c2) +
        A({ r: c2, x: x - width - c2, y: y + height })
      );

    case "bl":
      return (
        A({ r: c0, x, y: y - c0 }) +
        V(y - height + c1) +
        A({ r: c1, x: x - c1, y: y - height, sweep: 0 }) +
        H(x - width + c2) +
        A({ r: c2, x: x - width, y: y - height - c2 })
      );

    case "tl":
      return (
        A({ r: c0, x: x + c0, y }) +
        H(x + width - c1) +
        A({ r: c1, x: x + width, y: y - c1, sweep: 0 }) +
        V(y - height + c2) +
        A({ r: c2, x: x + width + c2, y: y - height })
      );
  }
}

export type PathPosition = { x: number; y: number };

type GeneratePathParams = {
  setup: Setup;
  cornerRadius: CornerRadius;
  invertedCorners: InvertedCorners;
  position?: PathPosition;
};

const DEFAULT_CORNERS: [number, number, number] = [16, 16, 16];

/** Get corners array with fallback to default */
const getCorners = (
  corner: InvertedCorner | undefined,
): [number, number, number] => corner?.corners ?? DEFAULT_CORNERS;

export const generatePath = ({
  setup,
  cornerRadius,
  invertedCorners,
  position = { x: 0, y: 0 },
}: GeneratePathParams): string => {
  const { width, height } = setup;
  const {
    tl: topLeft,
    tr: topRight,
    bl: bottomLeft,
    br: bottomRight,
  } = cornerRadius;
  const { tl, tr, bl, br } = invertedCorners;
  const { x, y } = position;

  let path = M(x + topLeft, y);

  // Top Side
  path += tr?.inverted
    ? H(x + width - (tr.width ?? 0) - getCorners(tr)[0])
    : H(x + width - topRight);

  // Top right corner
  if (tr?.inverted) {
    path += drawInvertedCorner(
      { width: tr.width ?? 0, height: tr.height ?? 0, corners: getCorners(tr) },
      { x: x + width - (tr.width ?? 0), y },
      "tr",
    );
  } else {
    path += A({ r: topRight, x: x + width, y: y + topRight });
  }

  // Right Side
  path += br?.inverted
    ? V(y + height - (br.height ?? 0) - getCorners(br)[0])
    : V(y + height - bottomRight);

  // Bottom right corner
  if (br?.inverted) {
    path += drawInvertedCorner(
      { width: br.width ?? 0, height: br.height ?? 0, corners: getCorners(br) },
      { x: x + width, y: y + height - (br.height ?? 0) },
      "br",
    );
  } else {
    path += A({ r: bottomRight, x: x + width - bottomRight, y: y + height });
  }

  // Bottom Side
  path += bl?.inverted
    ? H(x + (bl.width ?? 0) + getCorners(bl)[0])
    : H(x + bottomLeft);

  // Bottom Left corner
  if (bl?.inverted) {
    path += drawInvertedCorner(
      { width: bl.width ?? 0, height: bl.height ?? 0, corners: getCorners(bl) },
      { x: x + (bl.width ?? 0), y: y + height },
      "bl",
    );
  } else {
    path += A({ r: bottomLeft, x, y: y + height - bottomLeft });
  }

  // Left Side
  path += tl?.inverted
    ? V(y + (tl.height ?? 0) + getCorners(tl)[0])
    : V(y + topLeft);

  // Top left corner
  if (tl?.inverted) {
    path += drawInvertedCorner(
      { width: tl.width ?? 0, height: tl.height ?? 0, corners: getCorners(tl) },
      { x: x, y: y + (tl.height ?? 0) },
      "tl",
    );
    // Inverted corner ends at top edge, just close the path
    path += "Z";
  } else {
    path += A({ r: topLeft, x: x + topLeft, y }) + "Z";
  }

  return path;
};
