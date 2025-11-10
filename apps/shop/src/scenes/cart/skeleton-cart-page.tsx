import SkeletonCartItem from "@/components/skeleton/skeleton-cart-item";
import SkeletonCodeForm from "@/components/skeleton/skeleton-code-form";
import SkeletonOrderSummary from "@/components/skeleton/skeleton-order-summary";
import { Table, TableBody, TableHead, TableRow } from "@/components/ui/table";

import repeat from "@/utils/repeat";

const SkeletonCartPage = () => {
  return (
    <div className="py-12">
      <div className="content-container">
        <div className="small:grid-cols-[1fr_360px] grid grid-cols-1 gap-x-40">
          <div className="flex flex-col gap-y-6 bg-white p-6">
            <div className="flex items-start justify-between bg-white">
              <div className="flex flex-col gap-y-2">
                <div className="h-8 w-60 animate-pulse bg-gray-200" />
                <div className="h-6 w-48 animate-pulse bg-gray-200" />
              </div>
              <div>
                <div className="h-8 w-14 animate-pulse bg-gray-200" />
              </div>
            </div>
            <div>
              <div className="flex items-center pb-3">
                <div className="h-12 w-20 animate-pulse bg-gray-200" />
              </div>
              <Table>
                <TableHead className="border-t-0">
                  <TableRow>
                    <TableHead className="!pl-0">
                      <div className="h-6 w-10 animate-pulse bg-gray-200" />
                    </TableHead>
                    <TableHead></TableHead>
                    <TableHead>
                      <div className="h-6 w-16 animate-pulse bg-gray-200" />
                    </TableHead>
                    <TableHead>
                      <div className="h-6 w-12 animate-pulse bg-gray-200" />
                    </TableHead>
                    <TableHead className="!pr-0">
                      <div className="flex justify-end">
                        <div className="h-6 w-12 animate-pulse bg-gray-200" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {repeat(4).map((index) => (
                    <SkeletonCartItem key={index} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col gap-y-8">
            <SkeletonOrderSummary />
            <SkeletonCodeForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCartPage;
