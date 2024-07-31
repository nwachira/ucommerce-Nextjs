import { FrappeApp } from "frappe-js-sdk";

const SITE_URL = "http://localhost:8000"; // Replace with your site's URL
const API_SECRET = "2d2e5627d423c91";
const API_KEY = "6a56d2a4c01b301";

const frappe = new FrappeApp(SITE_URL, {
  useToken: true,
  token: () => `${API_KEY}:${API_SECRET}`,
  type: "token", // use "bearer" in case of oauth token
});

const db = frappe.db(); // Initialise the `db` class

async function getWebsiteItemsWithPrices() {
  try {
    // Fetch all Website Items
    const websiteItems = await db.getDocList("Website Item", {
      fields: ["*"], // Fetch all fields from the "Website Item" DocType
    });

    // Fetch all Item Prices with "Standard Selling" price list
    const itemPrices = await db.getDocList("Item Price", {
      fields: ["*"],
      filters: {
        price_list: "Standard Selling",
      },
    });

    // Fetch all Item data
    const items = await db.getDocList("Item", {
      fields: ["image"], // Fetch only the 'image' field
    });

    // Combine the data based on item_code
    const combinedData = websiteItems.map((websiteItem) => {
      const price = itemPrices.find(
        (itemPrice) => itemPrice.item_code === websiteItem.item_code
      );

      const item = items.find(
        (item) => item.item_code === websiteItem.item_code
      );

      // Extract currency and rate if price is found
      let currency = null;
      let rate = null;
      let image = null;
      if (price) {
        currency = price.currency;
        rate = price.price_list_rate;
      }
      if (item) {
        image = item.image;
      }

      return {
        ...websiteItem, // Include all fields from Website Item
        currency,
        rate,
        image,
      };
    });

    console.log(combinedData); // Log the combined data
    return combinedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default async function getProductData() {
  const combinedData = await getWebsiteItemsWithPrices();
  return combinedData;
}
