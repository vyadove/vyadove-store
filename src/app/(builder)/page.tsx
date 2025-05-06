import { getProducts } from "../api/services/products";
import { BuilderPage } from "./lib/BuilderPage";

const HomePage = async () => {
    const products = await getProducts();
    const mappedProducts = products.map((product) => ({
        ...product,
        category: "Category 1",
        description: "Product 1 description",
        image: product.variants[0].imageUrl,
        pageUrl: `/products/${product.handle}`,
        price: product.variants[0].price,
    }));

    return (
        <BuilderPage
            data={{
                products: mappedProducts,
            }}
            page={[""]}
        />
    );
};

export default HomePage;
