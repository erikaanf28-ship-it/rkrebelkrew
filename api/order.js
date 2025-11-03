// api/order.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const order = req.body;

    // ✅ Verificación básica
    if (!order || !order.items || order.items.length === 0) {
      return res.status(400).json({ message: "Datos del pedido inválidos" });
    }

    // 🧾 Construcción del pedido para Printful
    const printfulOrder = {
      external_id: order.external_id || `rk-${Date.now()}`,
      recipient: order.recipient, // {name, address1, city, state_code, country_code, zip}
      items: order.items, // [{variant_id, quantity}]
    };

    const apiKey = process.env.PRINTFUL_KEY;
    const auth = "Basic " + Buffer.from(`${apiKey}:`).toString("base64");

    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printfulOrder),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Printful:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ ok: true, printful: data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ message: "Error interno", error: err.message });
  }
};
