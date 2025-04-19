import { getPayload } from "payload";
import config from "@payload-config";

const seed = async () => {
    // Get a local copy of Payload by passing your config
    const payload = await getPayload({ config });

    const product = await payload.create({
        collection: "products",
        data: {
            title: "My Homepage",
            variants: [
                {
                    price: 100,
                }
            ]
            // other data to seed here
        },
    });
};

// Call the function here to run your seed script
await seed();
