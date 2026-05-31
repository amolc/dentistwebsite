# Implementation Plan - Rebranding & Enhancement Updates

This plan details the steps to modify the codebase of our dental website according to the specifications in `modification.md`.

## Goal Description
Rebrand the website from **AuraDental** to **Smile Dental Clinic** (based in Santacruz, Mumbai), adapt pricing and doctors to localized values (INR, Dr. Sanjay Ramani, and Dr. Bhavna Pimpale), integrate a responsive Google Map and WhatsApp chat bubble, and build a fully functional client-side Admin Panel driven by `localStorage` to manage appointments and view patient history.

---

## Proposed Changes

We will modify the core site files and introduce an admin subfolder:

```
/Users/amolc/2026/dentalwebsite/
├── admin/
│   ├── dashboard.html       # [NEW] Admin Dashboard UI
│   └── history.html         # [NEW] Patient History & Records UI
```

### 1. Global Rebranding & Pricing Conversions

#### [MODIFY] All HTML Pages: [index.html](file:///Users/amolc/2026/dentalwebsite/index.html), [about.html](file:///Users/amolc/2026/dentalwebsite/about.html), [services.html](file:///Users/amolc/2026/dentalwebsite/services.html), [booking.html](file:///Users/amolc/2026/dentalwebsite/booking.html), [contact.html](file:///Users/amolc/2026/dentalwebsite/contact.html)
- Change text "AuraDental" / "Aura Dental" to "Smile Dental Clinic".
- Change currency symbols from `$` to `₹` (INR) and update service pricing in according cards and descriptions.
- Set the local address: `201, 2nd Floor, Vertex Building, Opp. Shoppers Stop, Linking Road, Santacruz West, Mumbai, Maharashtra 400054`.
- Incorporate Dr. Sanjay Ramani and Dr. Bhavna Pimpale in `about.html` bios and scheduling forms.

#### [MODIFY] Custom Styles: [style.css](file:///Users/amolc/2026/dentalwebsite/assets/css/style.css)
- Add styling for the floating WhatsApp button and the new admin panels.
- Fine-tune table styling for appointment grids.

---

### 2. Localization & Widgets

#### [MODIFY] [contact.html](file:///Users/amolc/2026/dentalwebsite/contact.html)
- Embed the Santacruz Google Maps iframe block.
- Adjust clinic schedules to standard Indian business timings (Mon-Sat: 9:00 AM - 1:00 PM, 4:30 PM - 8:30 PM).

#### [MODIFY] Footer / Sidebar across all pages
- Inject a floating WhatsApp button with an icon linking to `https://wa.me/91XXXXXXXXXX` (with custom text).

---

### 3. Payment Gateway & Database Simulation

#### [MODIFY] [booking.html](file:///Users/amolc/2026/dentalwebsite/booking.html)
- Integrate Razorpay checkout modal simulation in step 4. When a user clicks "Confirm Appointment", open the Razorpay payment modal simulator (styled in brand navy colors), request mock payment, and on success save the appointment.

#### [MODIFY] [main.js](file:///Users/amolc/2026/dentalwebsite/assets/js/main.js)
- Update doctor choices and pricing dynamically.
- Implement booking storage to `localStorage`. On booking completion, store details to the `appointments` JSON array.

---

### 4. Admin Portal

#### [NEW] [dashboard.html](file:///Users/amolc/2026/dentalwebsite/admin/dashboard.html)
- Display clinic metrics: Total appointments, revenue in INR, pending/paid statistics.
- Table listing all appointments loaded from `localStorage`.
- Action buttons: "Mark Attended", "Cancel Appointment", "View Patient History".

#### [NEW] [history.html](file:///Users/amolc/2026/dentalwebsite/admin/history.html)
- Patient profile query tool by phone number.
- Timeline of treatments, cost charged, doctor signature, and diagnostic logs saved in `localStorage`.
- Form to add new clinical history entries.

---

## Verification Plan

### Manual Verification
1. Open the updated pages and verify all instances of "AuraDental" are renamed to "Smile Dental Clinic".
2. Verify currency labels display `₹` and prices are updated.
3. Test booking an appointment: pick Dr. Sanjay Ramani, verify Razorpay popup modal loads, complete simulated payment, and verify the success screen.
4. Navigate to `/admin/dashboard.html` and verify the appointment appears with details.
5. Add a patient history log for that patient phone number, navigate to `history.html`, and search their number to verify the history timeline loads.
