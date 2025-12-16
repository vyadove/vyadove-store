# Product Pricing Localization Plan

**Goal**: Add multi-currency support (USD, EUR, GBP) with automatic conversion from base currency.
**Scope**: Pricing only - no content localization.
**Rate Source**: Hybrid (API + manual override)
**Selector Location**: Header + Footer

---

## Phase 0: Setup

### 0.1 Save Plan

- Create `implementation-plans/` folder at repo root
- Save this plan as `implementation-plans/pricing-localization.md`

### 0.2 Create Git Worktree

```bash
git worktree add ../vyadove-pricing-localization -b feature/pricing-localization dev
```

- New worktree at `../vyadove-pricing-localization`
- Branch: `feature/pricing-localization` from `dev`

---

## Phase 1: Currency Infrastructure

### 1.1 Store Settings Enhancement

**File**: `apps/cms/src/globals/StoreSettings.ts`

- Add `baseCurrency` field (default: USD)
- Add `supportedCurrencies` array field (USD, EUR, GBP)
- Add `exchangeRates` group with manual rate overrides (optional)

### 1.2 Currency Service

**New file**: `apps/shop/src/services/currency-service.ts`

- Fetch exchange rates (Open Exchange Rates API or similar)
- Cache rates (server-side, refresh daily)
- `convertPrice(amount, fromCurrency, toCurrency)` function
- Fallback to manual rates from StoreSettings if API fails

### 1.3 Update Store Settings Fetcher

**File**: `apps/shop/src/services/store-settings.ts`

- Fetch from CMS instead of hardcoded values
- Include currency config in response

---

## Phase 2: Currency Selection

### 2.1 Currency Context

**New file**: `apps/shop/src/providers/currency/index.tsx`

- `CurrencyProvider` React context
- Store selected currency in localStorage
- Detect initial currency from browser locale or default to USD
- `useCurrency()` hook: `{ currency, setCurrency, convert }`

### 2.2 Currency Selector Component

**New file**: `apps/shop/src/components/currency-selector.tsx`

- Dropdown with USD/EUR/GBP flag icons
- Persist selection to localStorage
- Trigger context update

### 2.3 Add Selector to Layout

**Files to modify**:

- `apps/shop/src/components/header/` - Add selector near cart icon
- `apps/shop/src/components/footer/` - Add selector in settings area

---

## Phase 3: Price Display Updates

### 3.1 Update Money Utility

**File**: `apps/shop/src/utils/money.ts`

- Integrate with currency context
- Auto-convert to selected currency before formatting
- Keep `convertToLocale` signature compatible

### 3.2 Update Price Components

**Files to modify**:

- `apps/shop/src/components/products/product-card/price.tsx`
- `apps/shop/src/scenes/product-detail/product-price.tsx`
- `apps/shop/src/components/cart-totals.tsx`
- `apps/shop/src/scenes/checkout/order-summary.tsx`

Changes:

- Use `useCurrency()` hook for conversion
- Display converted prices with selected currency

---

## Phase 4: Checkout & Order Currency

### 4.1 Checkout Currency Handling

**File**: `apps/shop/src/providers/checkout/index.tsx`

- Store selected currency at checkout creation
- Lock currency for checkout session (no mid-checkout changes)
- Pass currency to order creation

### 4.2 Order Currency Storage

**File**: `apps/cms/src/collections/Orders/Orders.ts`

- Already has `currency` field - ensure populated correctly
- Store converted price at order time (snapshot)

---

## Phase 5: Exchange Rate Management (Optional)

### 5.1 Admin Rate Override UI

**File**: `apps/cms/src/globals/StoreSettings.ts`

- Add `exchangeRateOverrides` array
- Admin can set fixed rates if needed

### 5.2 Rate Refresh Endpoint

**New file**: `apps/cms/src/endpoints/refresh-rates.ts`

- Cron-triggered endpoint to update cached rates
- Or use Vercel Edge Config for edge caching

---

## Key Files to Modify

| File                                                       | Change                     |
| ---------------------------------------------------------- | -------------------------- |
| `apps/cms/src/globals/StoreSettings.ts`                    | Add currency config fields |
| `apps/shop/src/services/store-settings.ts`                 | Fetch from CMS             |
| `apps/shop/src/utils/money.ts`                             | Add conversion logic       |
| `apps/shop/src/providers/currency/index.tsx`               | New - currency context     |
| `apps/shop/src/components/currency-selector.tsx`           | New - UI selector          |
| `apps/shop/src/components/products/product-card/price.tsx` | Use currency context       |
| `apps/shop/src/scenes/product-detail/product-price.tsx`    | Use currency context       |
| `apps/shop/src/components/cart-totals.tsx`                 | Use currency context       |
| `apps/shop/src/providers/checkout/index.tsx`               | Lock currency at checkout  |

---

## Exchange Rate Strategy (Hybrid)

**Primary**: Fetch from ExchangeRate-API (1500 req/mo free tier)
**Fallback**: Manual rates set in CMS StoreSettings
**Refresh**: Daily via Vercel Cron or on-demand

Rate priority:

1. Manual override if set for currency pair
2. Cached API rate (< 24h old)
3. Fetch fresh rate from API
4. Fallback to last known rate

---

## Future Phases (Reference)

### Phase 6: Full Content Localization

- Enable Payload localization config
- Add localized fields to Products (title, description)
- Add language selector alongside currency

### Phase 7: Regional Pricing

- Allow manual price overrides per region
- Price rounding rules per currency (e.g., EUR to .99)
