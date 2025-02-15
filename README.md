# Billit Invoice - Client-Side Invoice Generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/c23e20fa-5fe7-4fda-b66f-f52bcdc15627/deploy-status)](https://app.netlify.com/sites/billit-invoice/deploys)

Billit Invoice is a web application that allows users to generate invoices locally without using any database. All processes occur on the client side, ensuring data privacy and fast performance. Users can input business details, client information, itemized services or products, payment terms, and more to create professional invoices.

---

## 🌟 Features
- **Business Information:**
  - Business Name, Address, Contact Info (Phone, Email)
  - Logo Upload for branding

- **Client Information:**
  - Client Name / Company Name, Address, Contact Info

- **Invoice Details:**
  - Unique Invoice Number (Auto-generated & Editable)
  - Invoice Date, Due Date, Currency Selection

- **Itemized List:**
  - Add multiple items with descriptions, quantities, unit prices, and totals
  - Dynamic add/remove items

- **Payment Details:**
  - Subtotal, Tax Calculation (VAT/GST), Discount Field
  - Total Amount Due Calculation

- **Payment Terms:**
  - Payment Methods (Bank Transfer, Credit Card, Cash)
  - Payment Instructions Field

- **Additional Options:**
  - Notes Section (Thank-you message, Payment reminders)
  - Terms & Conditions
  - Shipping Details
  - Supporting Documents Upload

- **Invoice Generation:**
  - Real-time Invoice Preview
  - Export as PDF, HTML, and JSON
  - Local Storage Auto-save Functionality

- **User Experience:**
  - Clean, Professional, and Premium UI Design
  - Responsive for Mobile and Desktop

---

## 🚀 Live Demo
Check out the live version: [Billit Invoice](https://billit-invoice.netlify.app/)

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript (Vanilla JS or React)
- **Styling:** TailwindCSS
- **PDF Generation:** jsPDF (for client-side PDF export)
- **Data Handling:** LocalStorage for temporary data saving
- **Hosting:** Netlify

---

## 📦 Installation and Setup

1. **Clone the repository:**
```sh
git clone https://github.com/thesurjo/billit-invoice.git
cd billit-invoice
```
2. **Install dependencies:**
```sh
npm install
```
3. 🚀 Run Development Server
```sh
npm run dev
```

---

## This project is hosted on Netlify. To deploy your own version:

1. **Fork the repository** on GitHub.
2. **Connect the forked repo to Netlify**.
3. Enable **automatic deployment** for continuous integration.
4. Update the Netlify badge link with your own in the README.

Alternatively, you can deploy on other platforms like Vercel or GitHub Pages by modifying the build and deployment settings accordingly.
