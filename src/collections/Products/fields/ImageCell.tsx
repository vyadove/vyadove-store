import React from "react";
import Image from "next/image";
import config from "@/payload.config";
import { getPayload, type DefaultServerCellComponentProps } from "payload";

const CustomImageCell = async (props: DefaultServerCellComponentProps) => {
	const payload = await getPayload({ config: config });

	const { cellData } = props;
	const media = await payload.findByID({
		collection: "media",
		id: cellData[0],
	});

	return (
		<Image
			src={media.url!}
			alt={media.alt}
			height={50}
			width={50}
			style={{ width: "auto", height: "50px" }}
		/>
	);
};

export default CustomImageCell;
