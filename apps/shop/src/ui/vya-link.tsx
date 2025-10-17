"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// import { Link, useTransitionRouter } from 'next-view-transitions'
import type { ComponentPropsWithRef } from "react";

export const VyaLink = (props: ComponentPropsWithRef<typeof Link>) => {
	// const router = useTransitionRouter();
	const router = useRouter();
	const strHref = typeof props.href === "string" ? props.href : props.href.href;

	const conditionalPrefetch = () => {
		if (strHref) {
			void router.prefetch(strHref);
		}
	};

	return (
		<Link
			{...props}
			onFocus={(e) => {
				conditionalPrefetch();

				return props.onFocus?.(e);
			}}
			onMouseEnter={(e) => {
				conditionalPrefetch();

				return props.onMouseEnter?.(e);
			}}
			onPointerEnter={(e) => {
				conditionalPrefetch();

				return props.onPointerEnter?.(e);
			}}
			onTouchStart={(e) => {
				conditionalPrefetch();

				return props.onTouchStart?.(e);
			}}
			prefetch={false}
		/>
	);
};
