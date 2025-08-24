import { Container } from "@medusajs/ui";
import Image from "next/image";

type ImageGalleryProps = {
    thumbnail?: null | string;
};

const ImageGallery = ({ thumbnail }: ImageGalleryProps) => {
    return (
        <div className="flex items-start relative">
            <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
                <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle">
                    {thumbnail && (
                        <img
                            alt={"Product image"}
                            className="absolute inset-0 rounded-rounded h-full"
                            // fill
                            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                            src={thumbnail}
                            style={{
                                objectFit: "cover",
                            }}
                        />
                    )}
                </Container>
            </div>
        </div>
    );
};

export default ImageGallery;
