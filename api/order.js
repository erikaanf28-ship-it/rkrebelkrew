export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const order = req.body;

    // 🧾 Construcción del pedido para Printful
    const printfulOrder = {
      external_id: order.external_id || `rk-${Date.now()}`,
      recipient: order.recipient, // {name, address1, city, state_code, country_code, zip}
      items: order.items,         // [{variant_id, quantity}]
    };

    // 🔑 Token de entorno (guardado en Vercel)
    const PRINTFUL_TOKEN = process.env.PRINTFUL_TOKEN;

    // 🚀 Llamada al endpoint de creación de pedidos
    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printfulOrder), // 👈 aquí debe ir "printfulOrder"
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error Printful:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ ok: true, printful: data });
  } catch (err) {
    console.error("💥 Error general:", err);
    return res.status(500).json({ message: "Error interno", error: err.message });
  }
}

};
