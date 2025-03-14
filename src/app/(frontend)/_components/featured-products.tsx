import ProductRail from "./product-rail";

export default async function FeaturedProducts({
	collections,
}: { collections: any[] }) {
	return collections.map((collection) => (
		<li key={collection.id}>
			<ProductRail collection={collection} />
		</li>
	));
}
