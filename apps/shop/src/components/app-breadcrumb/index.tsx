"use client";

import Link from "next/link";

import useAppBreadcrumbStore from "@/components/app-breadcrumb/breadcrumb.store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumb() {
  const { routeStack } = useAppBreadcrumbStore();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {routeStack.map((route) => (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Link
                  className="flex items-center gap-1"
                  href={route?.path || ""}
                >
                  {route?.icon && <route.icon />}
                  {route.name}
                </Link>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
