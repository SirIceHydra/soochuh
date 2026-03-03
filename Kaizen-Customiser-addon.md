# Product Customisation by KaizenTech – React Frontend API Guide

This document describes how the React frontend fetches and sends customisation data to the WordPress REST API. The API is provided by the theme (`functions.php`) and powered by the Product Customisation by KaizenTech plugin.

---

## 1. Base Configuration

### Base URL
```
{WORDPRESS_URL}/wp-json/soochuh/v1
```
Example: `https://wp-api.example.com/wp-json/soochuh/v1`

### Authentication
All endpoints require the `X-API-Key` header:

```http
X-API-Key: soochuh-react-2024
Content-Type: application/json
```

### CORS
Requests are allowed from configured origins (e.g. `http://localhost:3000`, `https://store.co.za`). Credentials are supported.

---

## 2. Fetching Product Customisation Options

### Endpoint
```
GET /products/{id}
```

### Example
```javascript
const response = await fetch(
  `${API_BASE}/products/${productId}`,
  {
    headers: {
      'X-API-Key': 'soochuh-react-2024',
      'Content-Type': 'application/json',
    },
  }
);
const product = await response.json();
```

### Response: `product_addons`

Customisation options are in the `product_addons` array. The plugin uses **profiles** (e.g. Shirt Customisation, Pant Customisation): each profile has its own options and category assignment. If the product is in a category assigned to a profile, that profile's options are returned. Otherwise `product_addons` is `null`.

```json
{
  "id": 123,
  "name": "Custom Scrubs",
  "price": "250.00",
  "product_addons": [
    {
      "id": "line_1",
      "name": "line_1",
      "label": "Line 1",
      "type": "text",
      "required": false,
      "price": 50,
      "price_type": "flat_fee",
      "options": [],
      "placeholder": "e.g. Name for embroidery"
    },
    {
      "id": "line_2",
      "name": "line_2",
      "label": "Line 2",
      "type": "text",
      "required": false,
      "price": 50,
      "price_type": "flat_fee",
      "options": [],
      "placeholder": "e.g. Department or title"
    },
    {
      "id": "logo",
      "name": "logo",
      "label": "Logo (PNG)",
      "type": "file",
      "required": false,
      "price": 100,
      "price_type": "flat_fee",
      "options": []
    }
  ]
}
```

### Addon Fields

| Field        | Type   | Description |
|-------------|--------|-------------|
| `id`        | string | Unique key. Use this when sending values in the order (e.g. `line_1`, `logo`). |
| `name`      | string | Same as `id`. |
| `label`     | string | Display label (e.g. "Line 1", "Logo (PNG)"). |
| `type`      | string | `"text"` or `"file"`. |
| `required`  | bool   | Whether the field is required. |
| `price`     | number | Price for this addon (or group price if `price_group` is set). |
| `price_type`| string | Usually `"flat_fee"`. |
| `options`   | array  | Empty for text/file; used for select-type addons. |
| `placeholder` | string | Placeholder for text inputs. |
| `price_group` | string | *(Optional)* If present, addons with the same `price_group` share one price. Charge once if the customer uses any addon in the group. |

### Price Groups

Addons with the same non-empty `price_group` share a single price:

- **Example:** Line 1 and Line 2 both have `price_group: "grp_abc123"` and `price: 50`.
- **Logic:** If the customer fills Line 1 only, Line 2 only, or both, the addon cost is 50 (not 100).

On the frontend, group addons by `price_group` for display (e.g. in a card or block with one shared price label).

---

## 3. Uploading Logo / Image Addons

### Endpoint
```
POST /logo/upload
```

### Request Body
```json
{
  "imageBase64": "data:image/png;base64,iVBORw0KGgo..."
}
```

- **Format:** Must be a PNG data URL (`data:image/png;base64,...`).

### Response
```json
{
  "success": true,
  "id": 456,
  "url": "https://example.com/wp-content/uploads/2025/02/product-logo-1234-5678.png"
}
```

### Example
```javascript
const response = await fetch(`${API_BASE}/logo/upload`, {
  method: 'POST',
  headers: {
    'X-API-Key': 'soochuh-react-2024',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ imageBase64: canvasOrFileToDataURL() }),
});
const { url } = await response.json();
// Store `url` as the value for the logo addon in the cart/order
```

---

## 4. Sending Customisation Data in Orders

### Endpoint
```
POST /orders/create
```
or
```
POST /orders
```

### Line Items with Addons

Each line item can include `meta_data` with addon values, and a pre-calculated `price` that includes addon fees.

```json
{
  "line_items": [
    {
      "product_id": 123,
      "variation_id": 456,
      "quantity": 1,
      "price": 400,
      "meta_data": [
        { "key": "Line 1", "value": "Dr. Smith" },
        { "key": "Line 2", "value": "Cardiology" },
        { "key": "Logo", "value": "https://example.com/wp-content/uploads/.../product-logo.png" }
      ]
    }
  ],
  "billing": { ... },
  "shipping": { ... },
  "shipping_lines": [ ... ]
}
```

### Meta Data Mapping

- **Text addons:** Use the addon `label` as `key` and the user’s text as `value`.
- **File addons:** Use the addon `label` as `key` and the uploaded image **URL** as `value`.

The backend expects the same mapping used for cart display; `label` is typically used for `key`.

### Price Calculation (Frontend)

The frontend should compute the line item `price` (base product + addons) before sending:

1. Start with base product price (including variation).
2. For each addon with a value:
   - If `price_group` is empty: add the addon’s `price`.
   - If `price_group` is set: add the addon’s `price` only once per group (first addon in the group defines the group price).

Example:

```javascript
function calculateAddonTotal(addons, values) {
  const chargedGroups = new Set();
  let total = 0;
  for (const addon of addons) {
    const value = values[addon.id];
    if (value == null || value === '') continue;
    if (addon.price_group) {
      if (chargedGroups.has(addon.price_group)) continue;
      chargedGroups.add(addon.price_group);
    }
    total += addon.price;
  }
  return total;
}
```

---

## 5. Flow Summary

1. **Product page:** `GET /products/{id}` → read `product_addons`.
2. **Show customiser UI:** Render addons, grouped by `price_group` where applicable.
3. **Logo upload:** `POST /logo/upload` with base64 PNG → use returned `url` as logo value.
4. **Add to cart / Checkout:** Compute total (base + addons) and send line items with:
   - `price`: base + addon total
   - `meta_data`: addon label/value pairs (text and logo URL).
