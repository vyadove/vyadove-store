"use client";

import { useMemo } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import useAppBreadcrumbStore from "@/components/app-breadcrumb/breadcrumb.store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { IconType } from "react-icons";

interface BreadcrumbSegment {
  name: string;
  path: string;
  isLast: boolean;
  icon?: IconType;
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const { routeStack } = useAppBreadcrumbStore();

  const segments = useMemo<BreadcrumbSegment[]>(() => {
    if (!pathname || pathname === "/") return [];

    const pathSegments = pathname.split("/").filter(Boolean);

    return pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      const isLast = index === pathSegments.length - 1;

      // Format segment name: replace hyphens with spaces and capitalize
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { name, path, isLast };
    });
  }, [pathname]);

  // Use routeStack if provided, otherwise use auto-generated segments
  const displaySegments =
    routeStack.length > 0
      ? routeStack.map((route, index) => ({
          name: route.name,
          path: route.path || "",
          isLast: index === routeStack.length - 1,
          icon: route.icon,
        }))
      : segments;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {displaySegments.map((segment, index) => (
          <div className="contents" key={segment.path || index}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {segment.isLast ? (
                <BreadcrumbPage>
                  <span className="flex items-center gap-1">
                    {"icon" in segment && segment?.icon && <segment.icon />}
                    {segment.name}
                  </span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link className="flex items-center gap-1" href={segment.path}>
                    {"icon" in segment && segment.icon && <segment.icon />}
                    {segment.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
