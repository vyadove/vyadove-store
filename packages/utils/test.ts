import { decryptToken, encryptToken } from "./src/fields/manage-tokens";

const rawToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // your real JWT or similar
const encrypted = encryptToken(rawToken);
console.log("Encrypted:", encrypted);

const decrypted = decryptToken(encrypted);
console.log("Decrypted:", decrypted);
