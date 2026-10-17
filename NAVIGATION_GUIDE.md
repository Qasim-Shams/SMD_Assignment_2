# React Navigation Project: Khidmat Connect & Professor Defense Guide

## 1. Project Overview & Idea: Khidmat Connect
This application is **Khidmat Connect**, an On-Demand Services Marketplace built with React Native and **React Navigation (v7)**.

Like modern service marketplace platforms:
1. **Users select the requested service** (e.g. AC Technician, Plumber, Mechanic, Electrician, etc.).
2. **Users specify their location / service zone** (Downtown, Uptown, Midtown, Suburbs).
3. **Verified specialists offer their bids / fares** (e.g., FastFix for $40, Prime Expert for $50).
4. **Users accept an offer**: It confirms the booking and **automatically pushes it to the "My Bookings" tab**.

All code is self-contained in **[App.tsx](file:///d:/expo%20cli/TodoApp/App.tsx)**.

---

## 2. Khidmat Connect Visual Theme Applied

* **Signature Palette**:
  * **Electric Lime Green (`#76C800`)**: Iconic accent color for primary action buttons, price badges, and status pills.
  * **Deep Charcoal / Black (`#121212`)**: Dark header bars and bottom tab navigation bar.
  * **Crisp Card Styling (`#FFFFFF` with `#E5E7EB` border)**: Clean, card-based layout with rounded corners (`borderRadius: 14`).
  * **Status Badges**:
    * `"Confirmed"`: Light lime pill badge (`#E8FDC9` with dark lime text `#2B5700`).
    * `"Completed"`: Subtle slate badge (`#F1F5F9`).

---

## 3. How Bookings Are Displayed in the Bookings Tab

A shared `BookingContext` connects the booking flow directly to the Bookings tab:
```tsx
const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);

const addBooking = (newBooking) => {
  const item = {
    ...newBooking,
    id: `b-${Date.now()}`,
    date: 'Just now',
    status: 'Confirmed',
  };
  setBookings((prev) => [item, ...prev]); // Prepends new booking to top
};
```
1. **Initial History**: Pre-loaded with realistic past bookings (`AC Technician` - Downtown, `Plumber` - Midtown) so the tab is never blank.
2. **Live Updates**: Whenever you tap **"Accept Offer"** on the Offers screen, `addBooking(...)` is called immediately.
3. **Switch to Bookings**: The Confirmation screen features a **"View in My Bookings Tab →"** button that takes you directly to the Bookings tab where your newly confirmed booking appears at the top.

---

## 4. Key React Navigation Concepts Demonstrated

| Requirement | Implementation in `App.tsx` | Explanation for Professor |
| :--- | :--- | :--- |
| **1. Pass data using route parameters** | `navigation.navigate('LocationSelect', { service })`<br>`navigation.navigate('Offers', { service, location })`<br>`navigation.navigate('Confirmation', { service, location, provider, price })` | Route parameters are passed as the 2nd argument of `navigate`. |
| **2. Display received parameters** | In `LocationSelectScreen`, `OffersScreen`, and `ConfirmationScreen` | Read via `const { ... } = route.params` and displayed in Khidmat Connect-styled cards and banners. |
| **3. Customize header title/options** | `navigation.setOptions({ headerTitle: ... })` + Dark header styles in navigators | Static dark header bar + dynamic title (`${service} Location`) based on route params. |
| **4. Header button with meaningful action** | `Info` pill button with `Alert.alert`<br>`Best Fares` button with `Alert.alert`<br>`Done ✓` button with `popToTop()` | Custom header buttons placed in `headerRight` that trigger alerts or reset the navigation stack. |
| **5. Combination of 2 navigators** | Nested **Bottom Tab Navigator** + **Native Stack Navigator** | `<Tab.Navigator>` hosts `<Stack.Navigator>` in Tab 1, plus a standalone `Bookings` screen in Tab 2. |

---

## 5. Flow Diagram

```mermaid
graph TD
    NC[NavigationContainer] --> TabNav[Bottom Tab Navigator - Khidmat Connect Dark Theme]
    
    subgraph Tab 1: Services Tab (Stack Navigator)
        TabNav --> S1[ServiceSelectScreen: Choose Service]
        S1 -- "passes: { service }" --> S2[LocationSelectScreen: Choose Area]
        S2 -- "passes: { service, location }" --> S3[OffersScreen: Specialist Bids]
        S3 -- "calls addBooking() & passes params" --> S4[ConfirmationScreen: Confirmed Ticket]
        S4 -- "navigation.popToTop()" --> S1
        S4 -- "navigation.navigate('Bookings')" --> B1
    end
    
    subgraph Tab 2: My Bookings Tab
        TabNav --> B1[BookingsScreen: Displays Live & Past Bookings]
        B1 -- "navigation.navigate('Services')" --> S1
    end
```

---

## 6. Viva / Professor Defense Q&A

### Q1: "Why did you choose the Khidmat Connect concept for this app?"
> **Answer:**
> Khidmat Connect is designed as an on-demand localized community service bidding platform. Users post service needs with their location, and local verified specialists bid with offers. This real-world architecture demonstrates multi-step React Navigation with parameter forwarding:
> `Service Selection` ➔ `Service Location` ➔ `Specialist Offers` ➔ `Booking Confirmation`.

### Q2: "How does the Bookings tab show the accepted offer?"
> **Answer:**
> We use a `BookingContext` state provider wrapping the `<NavigationContainer>`. When the user accepts an offer in `OffersScreen`, `addBooking(...)` prepends the new booking to state. Both the `OffersScreen` (inside the Stack) and `BookingsScreen` (inside the Tab) have access to this context, synchronizing the data across navigators.

### Q3: "How does navigation reset work after booking?"
> **Answer:**
> We use `navigation.popToTop()` on the Confirmation screen. This pops all intermediate screens (`LocationSelect`, `Offers`, `Confirmation`) off the stack and returns the user to the initial `ServiceSelectScreen`.
