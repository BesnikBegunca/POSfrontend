# TODO: Implement "Buy Now" Navigation to Payment Form

## Approved Plan
- Modify "Buy now" button in StorePage.jsx to navigate directly to /payment with autofilled query parameters (user details: fullName, email; store details: storeId, storeName; product details: productId, productName, price, qty=1).
- Remove the buy modal from StorePage.jsx.
- Update PaymentForm.jsx to read additional query params (storeId, productId) and add order creation logic after successful payment simulation.

## Steps
- [ ] Step 1: Modify StorePage.jsx - Remove modal state (buyOpen, selectedProduct), functions (openBuy, closeBuy), and JSX. Change "Buy now" button to navigate to /payment with query params.
- [ ] Step 2: Modify PaymentForm.jsx - Add storeId and productId from query params, implement order creation after payment simulation.
- [ ] Step 3: Test the changes (run the app and verify navigation and order creation).
