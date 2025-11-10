"use server";

import type { PrivacyPolicyPage } from "@vyadove/types";

import { payloadSdk } from "@/utils/payload-sdk";

export async function addToCartAction(
  formData: FormData,
): Promise<PrivacyPolicyPage | undefined> {
  "use server";

  try {
    const privacyPolicy = await payloadSdk
      .find({
        collection: "privacy-policy-page",
      })
      .then((res) => res.docs[0]);

    return privacyPolicy;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function submitContact(formData: FormData) {
  // "use server";

  try {
    const res = await payloadSdk.create({
      collection: "form-submissions",
      data: {
        form: 12,
        submissionData: [
          {
            field: "name",
            value: formData.get("name") as string,
          },
          {
            field: "email",
            value: formData.get("email") as string,
          },
          {
            field: "message",
            value: formData.get("message") as string,
          },
        ],
      },
    });

    return res;

  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }

  // mutate data
  // revalidate the cache
}
