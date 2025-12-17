# Product Pricing Localization Plan

**Goal**: Add multi-currency support (USD, EUR, GBP) with automatic conversion from base currency.
**Scope**: Pricing only - no content localization.
**Rate Source**: Hybrid (API + manual override)
**Selector Location**: Header + Footer

---

## Implementation Status

| Phase                              | Status | Notes                               |
| ---------------------------------- | ------ | ----------------------------------- |
| Phase 0: Setup                     | DONE   | Worktree created                    |
| Phase 1: Currency Infrastructure   | DONE   | CMS + Shop services                 |
| Phase 2: Currency Selection        | DONE   | Context + Selector + Layout         |
| Phase 3: Price Display Updates     | DONE   | Components updated                  |
| Phase 4: Checkout & Order Currency | DONE   | Currency synced to checkout/order   |
| Phase 5: Exchange Rate Management  | DONE   | Admin UI + API endpoint             |
| Phase 6: ETB Currency Support      | DONE   | Added ETB + Product currency select |
| Phase 7: GeoIP Currency Detection  | DONE   | Vercel geolocation                  |
| Phase 8: Price Rounding Rules      | DONE   | CMS-configurable charm/clean        |
| Phase 9: Stripe Adaptive Pricing   | DONE   | Hybrid mode                         |

---

## Phase 0: Setup - DONE

### 0.1 Save Plan

- [x] Create `implementation-plans/` folder at repo root
- [x] Save this plan as `implementation-plans/pricing-localization.md`

### 0.2 Create Git Worktree

- [x] Worktree at `../vyadove-pricing-localization`
- [x] Branch: `feature/pricing-localization` from `dev`

---

## Phase 1: Currency Infrastructure - DONE

### 1.1 Store Settings Enhancement - DONE

**File**: `apps/cms/src/globals/StoreSettings.ts`

- [x] Add `baseCurrency` field (default: USD)
- [x] Add `supportedCurrencies` array field (USD, EUR, GBP)
- [x] Add `exchangeRateOverrides` array for manual rates
- [x] Add `exchangeRateSource` select (api/manual)

### 1.2 Currency Service - DONE

**File**: `apps/shop/src/services/currency.ts`

- [x] Fetch exchange rates from ExchangeRate-API
- [x] Cache rates with `unstable_cache` (24h)
- [x] `convertPrice()` function
- [x] Fallback rates if API fails

### 1.3 Update Store Settings Fetcher - DONE

**File**: `apps/shop/src/services/store-settings.ts`

- [x] `fetchStoreSettings()` async function with CMS fetch
- [x] `getCurrencyConfig()` helper
- [x] Backwards-compatible `getStoreSettings()` (deprecated)

---

## Phase 2: Currency Selection - DONE

### 2.1 Currency Context - DONE

**File**: `apps/shop/src/providers/currency/index.tsx`

- [x] `CurrencyProvider` React context
- [x] Store selected currency in localStorage
- [x] `useCurrency()` hook with `{ currency, setCurrency, convert, formatPrice }`
- [x] `useCurrencyOptional()` safe hook for optional context

### 2.2 Currency Selector Component - DONE

**File**: `apps/shop/src/components/currency-selector.tsx`

- [x] Dropdown with USD/EUR/GBP + flag emojis
- [x] `variant="compact"` for header
- [x] Persist selection to localStorage

### 2.3 Add Selector to Layout - DONE

- [x] Header: `apps/shop/src/ui/nav/desktop-nav.tsx` - next to cart icon
- [x] Footer: `apps/shop/src/ui/footer/footer.tsx` - in bottom section

### 2.4 Provider Integration - DONE

**File**: `apps/shop/src/providers/providers.tsx`

- [x] Added `CurrencyProvider` wrapping `CheckoutProvider`

### 2.5 Exchange Rates API Route - DONE

**File**: `apps/shop/src/app/api/exchange-rates/route.ts`

- [x] GET endpoint returning rates from CMS config
- [x] 1-hour cache revalidation

---

## Phase 3: Price Display Updates - DONE

### 3.1 Update Money Utility - DONE

**File**: `apps/shop/src/utils/money.ts`

- [x] Keep `convertToLocale` backwards-compatible (deprecated)
- [x] Add `formatPrice()` helper
- [x] Add `convertAndFormatPrice()` for server components

### 3.2 Price Component - DONE

**New file**: `apps/shop/src/components/price.tsx`

- [x] `<Price>` component with currency conversion
- [x] `usePrice()` hook for formatting

### 3.3 Update Price Display Components - DONE

- [x] `apps/shop/src/components/products/product-card/index.tsx` - using `<Price>`
- [x] `apps/shop/src/scenes/product-detail/product-price.tsx` - using `usePrice()`
- [x] `apps/shop/src/components/cart-totals.tsx` - using `usePrice()`
- [x] `apps/shop/src/scenes/checkout/order-summary.tsx` - using `usePrice()`

---

## Phase 4: Checkout & Order Currency - DONE

### 4.1 Checkout Currency Handling - DONE

**File**: `apps/shop/src/providers/checkout/index.tsx`

- [x] Store selected currency at checkout creation
- [x] Sync currency changes to checkout via `updateCheckoutCurrencyAction`
- [x] Pass currency to order creation

**File**: `apps/shop/src/providers/checkout/checkout-actions.ts`

- [x] Added `currency` parameter to `createCheckoutAction` and `addToCheckoutAction`
- [x] Added `updateCheckoutCurrencyAction` function

### 4.2 Order Currency Storage - DONE

**File**: `apps/cms/src/collections/Orders/hooks/sync-from-checkout.ts`

- [x] `currency` field already synced from checkout via `syncFromCheckout` hook
- [x] Price snapshot stored at order time

---

## Phase 5: Exchange Rate Management (Optional) - DONE

### 5.1 Admin Rate Override UI - DONE

**File**: `apps/cms/src/globals/StoreSettings.ts`

- [x] "Exchange Rates" tab in Store Settings
- [x] `exchangeRateSource` select (API/Manual)
- [x] `exchangeRateOverrides` array with fromCurrency, toCurrency, rate fields
- [x] Admin can set fixed rates that override API values

### 5.2 Rate Refresh Endpoint - DONE

**File**: `apps/shop/src/app/api/exchange-rates/route.ts`

- [x] GET endpoint fetches rates from CMS config
- [x] Rates cached with 1-hour revalidation
- [x] Can trigger refresh via `revalidateTag("exchange-rates")`

**Note**: For Vercel Cron integration, add to `vercel.json`:

```json
{
    "crons": [
        {
            "path": "/api/exchange-rates",
            "schedule": "0 0 * * *"
        }
    ]
}
```

---

## Files Created/Modified

| File                                                       | Status   | Change                                         |
| ---------------------------------------------------------- | -------- | ---------------------------------------------- |
| `apps/cms/src/globals/StoreSettings.ts`                    | Modified | Added currency config tabs                     |
| `apps/shop/src/services/currency.ts`                       | New      | Exchange rate service                          |
| `apps/shop/src/services/store-settings.ts`                 | Modified | CMS fetch + currency config                    |
| `apps/shop/src/providers/currency/index.tsx`               | New      | Currency context                               |
| `apps/shop/src/components/currency-selector.tsx`           | New      | UI selector                                    |
| `apps/shop/src/components/price.tsx`                       | New      | Price display component                        |
| `apps/shop/src/utils/money.ts`                             | Modified | Added helpers                                  |
| `apps/shop/src/providers/providers.tsx`                    | Modified | Added CurrencyProvider                         |
| `apps/shop/src/ui/nav/desktop-nav.tsx`                     | Modified | Added selector                                 |
| `apps/shop/src/ui/footer/footer.tsx`                       | Modified | Added selector                                 |
| `apps/shop/src/app/api/exchange-rates/route.ts`            | New      | API route                                      |
| `apps/shop/src/components/products/product-card/index.tsx` | Modified | Using Price                                    |
| `apps/shop/src/scenes/product-detail/product-price.tsx`    | Modified | Using usePrice                                 |
| `apps/shop/src/components/cart-totals.tsx`                 | Modified | Using usePrice                                 |
| `apps/shop/src/scenes/checkout/order-summary.tsx`          | Modified | Using usePrice                                 |
| `apps/shop/src/providers/checkout/checkout-actions.ts`     | Modified | Currency params + updateCheckoutCurrencyAction |
| `apps/shop/src/providers/checkout/index.tsx`               | Modified | Currency sync to checkout                      |
| `apps/cms/src/collections/Products/Products.ts`            | Modified | Currency field → select with ETB               |

---

## Phase 6: ETB Currency Support - DONE

### 6.1 Added ETB (Ethiopian Birr) to supported currencies

- [x] `apps/shop/src/services/currency.ts` - Added ETB to SupportedCurrency type, fallback rates, symbols, names
- [x] `apps/cms/src/globals/StoreSettings.ts` - Added ETB to supportedCurrencyOptions
- [x] `apps/shop/src/components/currency-selector.tsx` - Added ETB with Ethiopian flag

### 6.2 Product collection currency field improvements

- [x] Changed product-level `currency` field from text to select
- [x] Changed variant `price.currency` field from text to select
- [x] Both fields now use same supportedCurrencies array for consistency

---

## Phase 7: GeoIP Currency Detection - DONE

### 7.1 Vercel Geolocation Middleware - DONE

**File**: `apps/shop/src/middleware.ts`

- [x] Read `x-vercel-ip-country` header from request
- [x] Map country code → default currency (US→USD, Eurozone→EUR, GB→GBP, ET→ETB)
- [x] Set `x-detected-currency` and `x-detected-country` headers
- [x] Applied to all routes except static files and API

### 7.2 Currency Provider Update - DONE

**File**: `apps/shop/src/providers/currency/index.tsx`

- [x] Accept `detectedCurrency` prop from server
- [x] Use detected currency as initial value if no localStorage preference
- [x] Priority: localStorage > detected > base currency

### 7.3 Layout Integration - DONE

**Files**: `apps/shop/src/app/layout.tsx`, `apps/shop/src/providers/providers.tsx`

- [x] Read detected currency from headers via `headers()`
- [x] Pass to Providers → CurrencyProvider

---

## Phase 8: Price Rounding Rules - DONE

### 8.1 CMS Rounding Configuration - DONE

**File**: `apps/cms/src/globals/StoreSettings.ts`

- [x] Added "Price Rounding" tab
- [x] `defaultRoundingRule` select (charm/.99, clean/.00, none)
- [x] `priceRoundingRules` array for per-currency overrides
- [x] Default: charm pricing (.99) for all currencies

### 8.2 Rounding Service - DONE

**File**: `apps/shop/src/services/currency.ts`

- [x] Added `RoundingRule` and `PriceRoundingRule` types
- [x] Added `applyRounding(amount, rule)` function
- [x] Added `getRoundingRule(currency, default, rules)` helper
- [x] Charm: round to nearest .99, Clean: round to whole number

### 8.3 Apply Rounding in Price Display - DONE

**Files**: `apps/shop/src/providers/currency/index.tsx`, `apps/shop/src/app/api/exchange-rates/route.ts`

- [x] API returns rounding rules from CMS config
- [x] CurrencyProvider fetches and stores rounding config
- [x] Apply rounding in `convert()` function after conversion

---

## Phase 9: Stripe Adaptive Pricing (Hybrid) - DONE

### 9.1 Stripe Configuration

**Stripe Dashboard** (manual step):

- [ ] Enable Adaptive Pricing in Stripe payment settings (default for new accounts)

### 9.2 Checkout Session Update - DONE

**File**: `packages/stripe-plugin/src/utilities/create-checkout-session.ts`

- [x] Added `currency` and `enableAdaptivePricing` params
- [x] Store `baseCurrency` in session metadata
- [x] Documentation comments added for Adaptive Pricing

**File**: `packages/stripe-plugin/src/services/stripe-checkout.ts`

- [x] Accept `currency` parameter
- [x] Pass currency to checkout session and order

### 9.3 Handle Presentment Details - DONE

**New file**: `apps/cms/src/webhooks/checkout-completed.ts`

- [x] Handle `checkout.session.completed` event
- [x] Read `presentment_details` from session
- [x] Update order with `presentmentCurrency` and `presentmentAmount`

**File**: `apps/cms/src/plugins.ts`

- [x] Register `checkoutCompleted` webhook handler

### 9.4 Order Fields - DONE

**File**: `apps/cms/src/collections/Orders/Orders.ts`

- [x] Added `presentmentCurrency` field (customer's actual payment currency)
- [x] Added `presentmentAmount` field (amount in presentment currency)

---

## Future Phases (Reference)

### Phase 10: Full Content Localization

- Enable Payload localization config
- Add localized fields to Products (title, description)
- Add language selector alongside currency

### Phase 11: Regional Pricing (PPP)

- Allow manual price overrides per region
- Purchasing Power Parity adjustments
