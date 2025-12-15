import Cookies from "js-cookie";

export const getSessionId = () => {
  return Cookies.get("cart-session") || "";
};
