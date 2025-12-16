import { Spinner } from "@/ui/shadcn/spinner";

const SkeletonOrderConfirmed = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] animate-pulse bg-gray-50 py-6">
      <div className="content-container flex justify-center">
        <div className="grid h-full w-full max-w-4xl place-items-center bg-white p-10">
          <Spinner className="size-max" size={40} />

          {/* <SkeletonOrderConfirmedHeader />

          <SkeletonOrderItems />


          <SkeletonOrderInformation /> */}
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return <SkeletonOrderConfirmed />;
}
