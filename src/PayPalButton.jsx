import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const PayPalButton = ({ total, deposito, onSuccess, onError }) => {
  // Convertir RD$ a USD (aproximado, 1 USD ≈ 58 RD$)
  const montoUSD = (deposito / 58).toFixed(2);

  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: `Reserva TerraMar - Depósito 50%`,
              amount: {
                currency_code: "USD",
                value: montoUSD
              }
            }
          ],
          application_context: {
            shipping_preference: "NO_SHIPPING"
          }
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then(function(details) {
          // Pago exitoso
          onSuccess(details);
        });
      }}
      onError={(err) => {
        onError(err);
      }}
    />
  );
};
