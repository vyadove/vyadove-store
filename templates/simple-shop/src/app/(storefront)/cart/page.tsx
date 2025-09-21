import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartContent } from "@/components/cart/cart-content";

export default function CartPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                Shopping Cart
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Review your items before checkout
                            </p>
                        </div>
                        <CartContent />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
