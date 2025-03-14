
import OrderCompletedTemplate from "@/app/(frontend)/_templates/order-completed-template"
import { getOrder } from "@/app/services/orders"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  // const order = await retrieveOrder(params.id).catch(() => null)
  const order = await getOrder(params.id)

  if (!order) {
    return notFound()
  }

  return <OrderCompletedTemplate order={order} />
}
