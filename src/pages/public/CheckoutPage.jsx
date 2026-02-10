import BillingDetails from "../../components/BillingDetails";

export default function CheckoutPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1220",
        padding: 24,
        display: "grid",
        placeItems: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ width: "min(920px, 100%)" }}>
        <BillingDetails />
      </div>
    </div>
  );
}
