import { UrlParams } from "../types";

/**
 * Extracts URL parameters from the current page
 * @returns Object containing identifier and token from URL params
 */
export const getUrlParams = (): UrlParams => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        identifier: urlParams.get("id"),
        token: urlParams.get("token"),
        theme: urlParams.get("theme"),
    };
};