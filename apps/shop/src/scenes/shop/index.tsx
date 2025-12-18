"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { ErrorAlert } from "@/scenes/shop/components/error-alert";
import { filterKeys } from "@/scenes/shop/components/util";
import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { Spinner } from "@/ui/shadcn/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@ui/shadcn/pagination";
import type { Product } from "@vyadove/types";

import { ProductPreview } from "@/components/products/product-card";

import { EmptyOutline } from "./components/empty-collections";

const itemLimit = 20;

const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages = 5,
) => {
  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  if (startPage === 1) {
    endPage = Math.min(totalPages, maxVisiblePages);
  }

  if (endPage === totalPages) {
    startPage = Math.max(1, totalPages - maxVisiblePages + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );
};

const ShopScene = () => {
  const searchParams = useSearchParams();

  const [productsResponse, setProductsResponse] = useState({
    product: [] as Product[],
    totalItems: 0,
    totalPages: 0,
    page: 1,
  });

  const selectedCategories = [
    ...(searchParams.get(filterKeys.experiences)?.split(",") || []),
    ...(searchParams.get(filterKeys.occasions)?.split(",") || []),
  ];

  const selectedPricesRange =
    searchParams.get(filterKeys.price)?.split(",") || [];

  const selectedSorting = searchParams.get(filterKeys.sortBy);

  const priceFilters = useMemo(() => {
    const priceFilter: Record<string, any>[] = [];

    selectedPricesRange.forEach((range) => {
      if (range.includes("plus")) {
        const [price] = range.split("-");

        priceFilter.push({
          "variants.price.amount": { greater_than_equal: price },
        });
      } else {
        const [min, max] = range.split("-");

        priceFilter.push({
          "variants.price.amount": {
            greater_than_equal: min,
            less_than_equal: max,
          },
        });
      }
    });

    return priceFilter;
  }, [selectedPricesRange]);

  const sortingFilter = useMemo(() => {
    const priceFilter: string[] = [];

    if (!selectedSorting) return priceFilter;

    if (selectedSorting === "low-high") {
      priceFilter.push("variants.price");
    } else if (selectedSorting === "high-low") {
      priceFilter.push("-variants.price");
    } else if (selectedSorting === "newest") {
      priceFilter.push("createdAt");
    } else {
      priceFilter.push("createdAt");
    }

    return priceFilter;
  }, [selectedSorting]);

  const q = searchParams.get("q");

  const searchQuery = usePayloadFindQuery("search" as any, {
    findArgs: {
      where: {
        title: { like: q || "" },
      },
      limit: 100,
    },
    useQueryArgs: {
      enabled: !!q,
    },
  });

  const searchIds = useMemo(() => {
    if (!q) return undefined;
    if (!searchQuery.data?.docs) return [];

    return searchQuery.data.docs
      .map((d) => d.doc?.value?.id || d.doc?.value)
      .filter(Boolean);
  }, [q, searchQuery.data]);

  // Check if search returned no results
  const hasNoSearchResults =
    !!q && searchQuery.isSuccess && searchIds?.length === 0;

  // Build where clause that combines search + category filters
  const whereClause = useMemo(() => {
    const conditions: any[] = [];

    // Search filter (when searching)
    if (q && searchIds?.length) {
      conditions.push({ id: { in: searchIds } });
    } else if (hasNoSearchResults) {
      // Force empty results when search finds nothing
      conditions.push({ id: { equals: -1 } });
    }

    // Category filter (when categories selected)
    if (selectedCategories.length > 0) {
      conditions.push({ ["category.handle"]: { in: selectedCategories } });
    }

    // Price filters
    if (priceFilters.length > 0) {
      conditions.push({ or: priceFilters });
    }

    // Return combined conditions with AND, or undefined if no conditions
    if (conditions.length === 0) return undefined;
    if (conditions.length === 1) return conditions[0];

    return { and: conditions };
  }, [q, searchIds, selectedCategories, priceFilters, hasNoSearchResults]);

  const productsQuery = usePayloadFindQuery("products", {
    findArgs: {
      depth: 2,
      page: productsResponse.page,
      limit: itemLimit,
      sort: sortingFilter,
      ...(whereClause && { where: whereClause }),
    },
    useQueryArgs: {
      enabled: !q || searchQuery.isSuccess,
    },
  });

  const errors = useMemo(() => {
    if (!productsQuery.data?.errors) return;

    return productsQuery.data?.errors?.map((err) => err.message) as string[];
  }, [productsQuery.data]);

  useEffect(() => {
    if (productsQuery.data) {
      setProductsResponse((prev) => ({
        ...prev,
        product: productsQuery.data?.docs || [],
        totalItems: productsQuery.data?.totalDocs || 0,
        totalPages: productsQuery.data?.totalPages || 0,
        page: productsQuery.data?.page || 1,
      }));
    }
  }, [productsQuery.data]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= productsResponse.totalPages) {
      setProductsResponse({
        ...productsResponse,
        page,
      });
    }
  };

  const pageNumbers = generatePageNumbers(
    productsResponse.page,
    productsResponse.totalPages,
  );

  return (
    <div className="flex flex-col gap-20">
      <div className="mt-12 grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {productsResponse?.product?.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>

      {productsQuery?.data?.docs?.length === 0 && (
        <div className="mx-auto grid w-full w-max place-items-center py-20">
          <EmptyOutline />
        </div>
      )}

      {errors && (
        <ErrorAlert className="mx-auto w-max" errorMessages={errors} />
      )}

      {productsQuery.isLoading && (
        <div className="mx-auto grid w-full w-max place-items-center py-20">
          <Spinner />
        </div>
      )}

      {/*--- PAGINATION ------*/}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                productsResponse.page === 1
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(productsResponse.page - 1);
              }}
              // Disable if on the first page
              href="#"
            />
          </PaginationItem>

          {/* Start ellipsis */}
          {(pageNumbers[0] || 0) > 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Loop through page numbers */}
          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={productsResponse.page === page}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* End ellipsis */}
          {(pageNumbers[pageNumbers?.length - 1] || 0) <
            productsResponse.totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              className={
                productsResponse.page === productsResponse.totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(productsResponse.page + 1);
              }}
              // Disable if on the last page
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ShopScene;
