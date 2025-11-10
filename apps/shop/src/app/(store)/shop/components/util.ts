import { useRouter, useSearchParams } from "next/navigation";

export const filterKeys = {
  category: "category",
  price: "price",
  sortBy: "sort_by",
};

export function useUpdateMultiFilterParam(
  key: string,
  allowedReadableKeys: string[] = Object.values(filterKeys),
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  return {
    updateSearchParam: (value: string, localKey = key) => {
      const newParams = new URLSearchParams(searchParams.toString());
      const currentValues = newParams.get(localKey)?.split(",") || [];

      // Toggle the value
      let updatedValues: string[];

      if (currentValues.includes(value)) {
        updatedValues = currentValues.filter((v) => v !== value);
      } else {
        updatedValues = [...currentValues, value];
      }

      // Update query
      if (updatedValues.length === 0) newParams.delete(localKey);
      else newParams.set(localKey, updatedValues.join(","));

      // Build encoded query, but decode commas for selected localKey
      let encodedQuery = newParams.toString();

      for (const k of allowedReadableKeys) {
        const regex = new RegExp(`${k}=([^&]+)`);

        encodedQuery = encodedQuery.replace(regex, (_, val) => {
          return `${k}=${decodeURIComponent(val)}`;
        });
      }

      return encodedQuery;
    },

    reset: (localKey = key) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      newSearchParams.delete(localKey);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    resetMultiple: (keys: string[]) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      keys.forEach((k) => newSearchParams.delete(k));
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
  };
}
