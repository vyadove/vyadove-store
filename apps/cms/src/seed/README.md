# Database Seeding System

This seeding system generates realistic gift experience products and categories for testing and development.

## Overview

- **Categories**: ~63 categories (10 parent + 53 subcategories)
- **Products**: 2000-3000+ configurable gift experiences
- **Separate Endpoints**: Manage categories and products independently

## Category Structure

10 parent categories with subcategories:

1. **Dining & Culinary** (7 subcategories)

    - Fine Dining, Wine & Spirits, Cooking Classes, Food Tours, Afternoon Tea, Brewery & Distillery, Private Dining

2. **Wellness & Spa** (6 subcategories)

    - Spa Days, Massage Therapy, Yoga & Meditation, Wellness Retreats, Fitness Experiences, Beauty Treatments

3. **Adventure & Outdoor** (6 subcategories)

    - Air Adventures, Water Sports, Land Adventures, Wildlife Experiences, Winter Sports, Cycling Tours

4. **Stays & Travel** (7 subcategories)

    - Romantic Getaways, Beach Resorts, Mountain Retreats, City Breaks, Glamping, B&B, Luxury Hotels

5. **Celebrations & Events** (5 subcategories)

    - Birthday Parties, Anniversary Celebrations, Engagement & Proposals, Baby Showers, Graduation Celebrations

6. **Arts & Culture** (6 subcategories)

    - Photography, Art Classes, Music Experiences, Theater & Shows, Museum Tours, Dance Classes

7. **For Couples** (4 subcategories)

    - Date Nights, Couple's Spa, Romantic Dinners, Adventure for Two

8. **For Groups** (4 subcategories)

    - Team Building, Bachelor & Bachelorette, Family Activities, Friend Groups

9. **Seasonal Experiences** (5 subcategories)

    - Summer Activities, Winter Experiences, Holiday Specials, Spring Adventures, Fall Experiences

10. **By Price Range** (4 subcategories)
    - Under $100, $100-$250, $250-$500, Luxury ($500+)

## Product Types

16 different experience templates:

- Fine Dining (tasting menus, chef's tables)
- Spa Days (full packages, treatments)
- Hot Air Balloon rides
- Cooking Classes (various cuisines)
- Weekend Getaways (cabins, resorts)
- Wine Tasting tours
- Massage sessions
- Helicopter tours
- Birthday celebrations
- Yoga & Meditation retreats
- Photography workshops
- Brewery tours
- Water sports activities
- Afternoon tea services
- Zip lining adventures
- Art classes

Each product includes:

- Multiple variants (1-3) with different options
- Realistic pricing ($40-$1200 range)
- Detailed descriptions
- Custom fields with rich text
- Category assignments

## API Endpoints

### 1. Seed Categories Only

```bash
POST http://localhost:3000/api/seed/categories
```

Creates ~63 categories with parent-child relationships.

**Response:**

```json
{
    "success": true,
    "message": "Categories seeded successfully"
}
```

### 2. Seed Products Only

```bash
POST http://localhost:3000/api/seed/products?count=2500
```

**Query Parameters:**

- `count` (optional): Number of products to generate (default: 2500, max: 5000)

**Response:**

```json
{
    "success": true,
    "message": "Products seeded successfully",
    "created": 2500,
    "errors": 0,
    "total": 2500
}
```

### 3. Seed Everything

```bash
POST http://localhost:3000/api/seed/all?count=3000
```

Seeds categories first, then products. Recommended for initial setup.

**Query Parameters:**

- `count` (optional): Number of products to generate (default: 2500, max: 5000)

**Response:**

```json
{
    "success": true,
    "message": "Database seeded successfully",
    "categories": "~63 categories created",
    "products": {
        "created": 3000,
        "errors": 0,
        "total": 3000
    }
}
```

## Usage Examples

### Using cURL

```bash
# Seed everything with default 2500 products
curl -X POST http://localhost:3000/api/seed/all

# Seed 3000 products
curl -X POST http://localhost:3000/api/seed/all?count=3000

# Seed only categories
curl -X POST http://localhost:3000/api/seed/categories

# Seed only products (requires categories to exist)
curl -X POST http://localhost:3000/api/seed/products?count=2000
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3000/api/seed/all?count=2500`
3. Send request
4. Check response for success status

### Using JavaScript/Fetch

```javascript
// Seed everything
const response = await fetch("http://localhost:3000/api/seed/all?count=2500", {
    method: "POST",
});
const result = await response.json();
console.log(result);
```

## Development Commands

### Run seed scripts directly (alternative to API)

```bash
# From apps/cms directory:

# Seed categories
pnpm tsx ./src/seed/seed-categories.ts

# Seed products (with custom count)
pnpm tsx ./src/seed/seed-products.ts 3000
```

## File Structure

```
apps/cms/src/seed/
├── README.md                    # This file
├── categories.json              # Category definitions
├── seed-categories.ts           # Category seeding logic
├── product-generator.ts         # Product generation engine
├── seed-products.ts             # Product seeding logic
└── products.json                # Sample products (legacy)

apps/cms/src/app/(payload)/api/seed/
├── categories/route.ts          # Category seed endpoint
├── products/route.ts            # Product seed endpoint
└── all/route.ts                 # Combined seed endpoint
```

## Performance Notes

- **Categories**: Takes ~5-10 seconds for 63 categories
- **Products**: Approximately 1-2 minutes per 1000 products
    - 2000 products: ~2-4 minutes
    - 3000 products: ~3-6 minutes
    - 5000 products: ~5-10 minutes

Processing happens in batches of 50 to avoid database overload.

## Important Notes

### Prerequisites

1. CMS must be running (`pnpm dev:cms`)
2. Database must be initialized
3. Collections must exist (products, category, media)

### Data Considerations

- Products are generated with random variations
- Each run creates **new** products (doesn't check for duplicates)
- Categories use unique titles, so re-running category seed may cause duplicates
- Consider clearing data between test runs

### Clearing Data

To clear seeded data:

```bash
# Via CMS admin UI:
# 1. Go to Products collection
# 2. Select all
# 3. Delete selected

# Or drop/reset database for clean slate
```

### Production Warning

⚠️ **Do not use these endpoints in production** without authentication/authorization!

These endpoints are designed for development and testing only.

## Troubleshooting

### "Category not found" warnings

- Run category seed first: `POST /api/seed/categories`
- Check that categories exist in CMS admin

### Timeout errors

- Reduce product count (try 1000-1500 first)
- Check database connection
- Monitor server logs

### Memory issues

- Reduce batch size in `seed-products.ts` (currently 50)
- Seed in multiple smaller batches

### Variant errors

- Check Products collection schema matches expected fields
- Ensure price.amount and price.currency fields exist

## Testing the Seeded Data

After seeding:

1. **CMS Admin**: Visit http://localhost:3000/admin

    - Check Products collection
    - Check Category collection
    - Verify relationships

2. **Shop Frontend**: Visit http://localhost:3020

    - Browse products
    - Test search
    - Check category filtering

3. **API Testing**:

    ```bash
    # Get all products
    curl http://localhost:3000/api/products

    # Get categories
    curl http://localhost:3000/api/category
    ```

## Customization

### Adding New Product Types

Edit `apps/cms/src/seed/product-generator.ts`:

```typescript
const productTemplates: ProductTemplate[] = [
    // ... existing templates
    {
        titleTemplate: ["Your {adjective} Experience"],
        descriptions: ["Your description template"],
        category: "Your Category Name",
        priceRange: [100, 300],
        pricingTier: "premium",
        variantOptions: [
            /* ... */
        ],
        customFields: [
            /* ... */
        ],
    },
];
```

### Adjusting Product Count

Modify default in endpoints or pass `count` parameter:

- Minimum: 1
- Maximum: 5000
- Recommended: 2000-3000

### Custom Categories

Edit `apps/cms/src/seed/categories.json` and add/modify categories.

## Support

For issues or questions:

1. Check server logs for detailed errors
2. Verify database connection
3. Ensure CMS is running
4. Check that collections exist in Payload config

---

Happy testing! 🎁
