export const generateInvoiceHtml = ({ orderId, customerEmail, address, items, total, paymentId }) => {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #f1d9e4;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #f1d9e4;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #f1d9e4;">₹${item.price}</td>
      </tr>`
    )
    .join('');

  return `
  <div style="font-family:Inter,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#fff7fb;border:1px solid #f8d8e6;border-radius:16px;">
    <h2 style="color:#9b5f7a;">Pavoire Jewellery Receipt</h2>
    <p>Order: <strong>${orderId}</strong></p>
    <p>Email: ${customerEmail}</p>
    <p>Address: ${address}</p>
    <table style="width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;">
      <thead><tr><th align="left" style="padding:8px;background:#fde5f0;">Item</th><th align="left" style="padding:8px;background:#fde5f0;">Qty</th><th align="left" style="padding:8px;background:#fde5f0;">Price</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin-top:16px;"><strong>Total: ₹${total}</strong></p>
    <p>Payment ID: ${paymentId}</p>
  </div>`;
};
