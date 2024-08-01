// footer.js
import { SITE_URL, API_SECRET, API_KEY } from './config'; 
import { FrappeApp } from "frappe-js-sdk";

const frappe = new FrappeApp(SITE_URL, {
  useToken: true,
  token: () => `${API_KEY}:${API_SECRET}`,
  type: "token", // use "bearer" in case of oauth token
});

const db = frappe.db(); // Initialise the `db` class

