import { cn } from "@/lib/utils"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@/icons/placeholder-image"
import { getThumbnailUrl } from "@/lib/utils/get-thumbnail-url"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image type 교체
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={cn(
        "bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover relative w-full overflow-hidden p-4 transition-shadow duration-150 ease-in-out aspect-square",
        className,
        {
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={getThumbnailUrl(image)}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
