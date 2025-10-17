"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";

interface CartSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
	const { cart, itemCount, optimisticUpdate, optimisticRemove } = useCart();

	async function handleUpdateQuantity(variantId: string, quantity: number) {
		try {
			await optimisticUpdate(variantId, quantity);
		} catch (error) {
			// Error is already logged in context, could show toast here
		}
	}

	async function handleRemoveItem(variantId: string) {
		try {
			await optimisticRemove(variantId);
		} catch (error) {
			// Error is already logged in context, could show toast here
		}
	}

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay with blur */}
			<div
				className="fixed inset-0 z-40 h-screen w-screen bg-black/30 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div className="fixed top-0 right-0 z-50 h-screen w-96 max-w-full bg-white shadow-xl transition-transform">
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-b p-4">
						<div className="flex items-center gap-2">
							<ShoppingBag className="h-5 w-5" />
							<h2 className="text-lg font-semibold">Cart ({itemCount})</h2>
						</div>
						<button aria-label="Close cart" className="rounded-full p-1 hover:bg-gray-100" onClick={onClose}>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto">
						{!cart || !cart.items || cart.items.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
								<ShoppingBag className="h-12 w-12 text-gray-300" />
								<div>
									<h3 className="font-medium text-gray-900">Your cart is empty</h3>
									<p className="text-sm text-gray-500">Start shopping to add items to your cart</p>
								</div>
							</div>
						) : (
							<div className="space-y-4 p-4">
								{cart.items.map((item) => {
									// Product info is now directly available in item.product
									const {product} = item;
									const {price} = item; // Already in dollars

									return (
										<div className="flex items-start gap-3 border-b pb-4" key={item.id}>
											{/* Product Image */}
											<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
												{product?.images?.[0] ? (
													<Image
														alt={product.name || "Product"}
														className="h-full w-full object-cover"
														height={64}
														src={product.images[0]}
														width={64}
													/>
												) : (
													<div className="flex h-full w-full items-center justify-center">
														<ShoppingBag className="h-6 w-6 text-gray-300" />
													</div>
												)}
											</div>

											{/* Product Info */}
											<div className="min-w-0 flex-1">
												<h3 className="truncate text-sm font-medium text-gray-900">
													{product?.name || `Product ${item.productId}`}
												</h3>
												<p className="mt-1 text-sm text-gray-600">
													{formatMoney({
														amount: price,
														currency: cart.currency || "USD",
														locale: "en-US",
													})}
												</p>
											</div>

											{/* Quantity Controls */}
											<div className="flex flex-col items-end gap-2">
												<button
													aria-label="Remove item"
													className="p-1 text-red-500 hover:text-red-700"
													onClick={() => handleRemoveItem(item.variantId || item.productId)}
												>
													<X className="h-4 w-4" />
												</button>
												<div className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1">
													<button
														className="rounded-full p-1 hover:bg-gray-200"
														disabled={item.quantity <= 1}
														onClick={() =>
															handleUpdateQuantity(item.variantId || item.productId, item.quantity - 1)
														}
													>
														<Minus className="h-3 w-3" />
													</button>
													<span className="min-w-[1.5rem] text-center text-sm font-medium">
														{item.quantity}
													</span>
													<button
														className="rounded-full p-1 hover:bg-gray-200"
														onClick={() =>
															handleUpdateQuantity(item.variantId || item.productId, item.quantity + 1)
														}
													>
														<Plus className="h-3 w-3" />
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Footer with Total */}
					{cart && cart.items.length > 0 && (
						<div className="space-y-4 border-t p-4">
							<div className="flex items-center justify-between text-lg font-semibold">
								<span>Total:</span>
								<span>
									{formatMoney({
										amount: cart.total || 0,
										currency: cart.currency || "USD",
										locale: "en-US",
									})}
								</span>
							</div>
							<button className="w-full rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
								Checkout (Demo)
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
