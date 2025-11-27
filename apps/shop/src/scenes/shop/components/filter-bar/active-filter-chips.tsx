"use client";

import React, { useMemo } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { TypographyMuted, TypographySmall } from "@ui/shadcn/typography";
import type { Category } from "@vyadove/types";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { filterKeys } from "../util";

interface ActiveFilter {
	type: "experience" | "occasion" | "price" | "sortBy";
	value: string;
	label: string;
	filterKey: string;
}

export const ActiveFilterChips = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Fetch Experiences
	const experiencesQuery = usePayloadFindQuery("category", {
		findArgs: {
			where: {
				handle: {
					equals: "experiences",
				},
			},
			limit: 1,
		},
	});

	const experiences = useMemo(() => {
		if (!experiencesQuery.data?.docs?.length) return [];

		return (
			(experiencesQuery.data.docs[0]?.subcategories?.docs as Category[]) || []
		);
	}, [experiencesQuery.data]);

	// Fetch Occasions
	const occasionsQuery = usePayloadFindQuery("category", {
		findArgs: {
			where: {
				handle: {
					equals: "occasions",
				},
			},
			limit: 1,
		},
	});

	const occasions = useMemo(() => {
		if (!occasionsQuery.data?.docs?.length) return [];

		return (
			(occasionsQuery.data.docs[0]?.subcategories?.docs as Category[]) || []
		);
	}, [occasionsQuery.data]);

	// Build active filters array
	const activeFilters = useMemo(() => {
		const filters: ActiveFilter[] = [];

		// Experiences
		const experienceValues =
			searchParams.get(filterKeys.experiences)?.split(",") || [];

		experienceValues.forEach((value) => {
			const category = experiences.find((exp) => exp.handle === value);

			if (category) {
				filters.push({
					type: "experience",
					value,
					label: category.title || value,
					filterKey: filterKeys.experiences,
				});
			}
		});

		// Occasions
		const occasionValues =
			searchParams.get(filterKeys.occasions)?.split(",") || [];

		occasionValues.forEach((value) => {
			const category = occasions.find((occ) => occ.handle === value);

			if (category) {
				filters.push({
					type: "occasion",
					value,
					label: category.title || value,
					filterKey: filterKeys.occasions,
				});
			}
		});

		// Price
		const priceValues = searchParams.get(filterKeys.price)?.split(",") || [];

		priceValues.forEach((value) => {
			const [start, end] = value.split("-");
			const label =
				end === "plus" ? `Br${start}+` : `Br${start} - Br${end}`;

			filters.push({
				type: "price",
				value,
				label,
				filterKey: filterKeys.price,
			});
		});

		// Sort By (only show if not default)
		const sortByValue = searchParams.get(filterKeys.sortBy);

		if (sortByValue && sortByValue !== "default") {
			const sortLabels: Record<string, string> = {
				"low-high": "Price: Low to High",
				"high-low": "Price: High to Low",
				newest: "Newest",
				rating: "Rating",
				reviewed: "Most Reviewed",
			};

			filters.push({
				type: "sortBy",
				value: sortByValue,
				label: sortLabels[sortByValue] || sortByValue,
				filterKey: filterKeys.sortBy,
			});
		}

		return filters;
	}, [searchParams, experiences, occasions]);

	const handleRemoveFilter = (filter: ActiveFilter) => {
		const newParams = new URLSearchParams(searchParams.toString());
		const currentValues = newParams.get(filter.filterKey)?.split(",") || [];

		// Remove the specific value
		const updatedValues = currentValues.filter((v) => v !== filter.value);

		if (updatedValues.length > 0) {
			newParams.set(filter.filterKey, updatedValues.join(","));
		} else {
			newParams.delete(filter.filterKey);
		}

		router.push(`?${newParams.toString()}`, { scroll: false });
	};

	const handleClearAll = () => {
		const newParams = new URLSearchParams(searchParams.toString());

		newParams.delete(filterKeys.experiences);
		newParams.delete(filterKeys.occasions);
		newParams.delete(filterKeys.price);
		newParams.delete(filterKeys.sortBy);

		router.push(`?${newParams.toString()}`, { scroll: false });
	};

	if (activeFilters.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			<TypographySmall className="text-muted-foreground">
				Active filters:
			</TypographySmall>
			{activeFilters.map((filter, idx) => (
				<Badge
					className={cn(
						"flex items-center gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-primary/80 transition-colors",
					)}
					key={`${filter.filterKey}-${filter.value}-${idx}`}
					onClick={() => handleRemoveFilter(filter)}
					variant="default"
				>
					<TypographySmall className='font-light'>{filter.label}</TypographySmall>
					<X className="size-3" />
				</Badge>
			))}
			{activeFilters.length > 1 && (
				<Button onClick={handleClearAll} size="sm" variant="link">
					Clear all
				</Button>
			)}
		</div>
	);
};
