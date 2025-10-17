import Product from "@/templates/product";

type RelatedProductsProps = {
    product: any;
};

export default function RelatedProducts({ product }: RelatedProductsProps) {
    // edit this function to define your related products logic
    const queryParams: any = {};
    if (product.collection_id) {
        queryParams.collection_id = [product.collection_id];
    }
    if (product.tags) {
        queryParams.tag_id = product.tags
            .map((t: any) => t.id)
            .filter(Boolean) as string[];
    }
    queryParams.is_giftcard = false;

    const products = [
        {
            id: 1,
            createdAt: "2023-03-01T00:00:00.000Z",
            handle: "product-1",
            thumbnail:
                "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fheadphones-nobg-1700675136219.png&w=1920&q=50",
            title: "Product 1",
            updatedAt: "2023-03-01T00:00:00.000Z",
            variants: [
                {
                    id: "1",
                    calculated_price: "$10.00",
                    original_price: "$10.00",
                    price: 10,
                    price_type: "sale",
                    title: "Black Audio Arrogance AuralElite",
                },
            ],
        },
    ];

    if (!products.length) {
        return null;
    }

    return (
        <div className="product-page-constraint">
            <div className="flex flex-col items-center text-center mb-16">
                <span className="text-base-regular text-gray-600 mb-6">
                    Related products
                </span>
                <p className="text-2xl-regular text-ui-fg-base max-w-lg">
                    You might also want to check out these products.
                </p>
            </div>

            <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
                {products.map((product) => (
                    <li key={product.id}>
                        <Product product={product} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
