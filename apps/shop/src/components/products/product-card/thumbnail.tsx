import type React from "react";

import Image from "next/image";

import { clsx } from "clsx";

import PlaceholderImage from "./placeholder-image";

type ThumbnailProps = {
  className?: string;
  "data-testid"?: string;
  // TODO: Fix image typings
  isFeatured?: boolean;
  size?: "full" | "large" | "medium" | "small" | "square";
  thumbnail?: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
  className,
  "data-testid": dataTestid,
  isFeatured,
  size = "small",
  thumbnail,
}) => {
  return (
    <div
      className={clsx(
        "bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover relative w-full overflow-hidden p-4 transition-shadow duration-150 ease-in-out",
        className,
        {
          "aspect-[1/1]": size === "square",
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[11/14]": isFeatured,
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        },
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={thumbnail} size={size} />
    </div>
  );
};

const ImageOrPlaceholder = ({
  image,
  size,
}: { image?: string } & Pick<ThumbnailProps, "size">) => {
  return image ? (
    <Image
      alt="Product image"
      className="rounded-rounded absolute inset-0 h-full object-cover"
      decoding="async"
      loading="lazy"
      src={image}
    />
  ) : (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  );
};

export default Thumbnail;
