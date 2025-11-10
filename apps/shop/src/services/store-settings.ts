export const getStoreSettings = () => {
    // const payload = await getPayload({ config });
    // const storeSettings = await payload.findGlobal({
    //     slug: "store-settings",
    // });

    // return storeSettings;
    return {
        // currency: "USD",
        currency: "ETB",
        currencyFormat: "symbol",
        // currencySymbol: "$",
        currencySymbol: "Br",
        dateFormat: "MMMM d, yyyy",
        locale: "en-US",
        timeFormat: "H:mm",
        timezone: "America/Los_Angeles",
    };
};
