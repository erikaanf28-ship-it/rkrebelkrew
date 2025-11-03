export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const event = req.body;

    // Verificamos si el evento es de orden completada
    if (event.eventName !== "order.completed") {
      return res.status(200).json({ ok: true, message: "Evento ignorado" });
    }

    const order = event.content;

    // Construimos el pedido para Printful
    const printfulOrder = {
      recipient: {
        name: order.user.name,
        address1: order.shippingAddress.address1,
        city: order.shippingAddress.city,
        country_code: order.shippingAddress.country,
        zip: order.shippingAddress.postalCode,
        email: order.user.email,
      },
      items: order.items.map((item) => ({
        variant_id: item.metadata.printful_variant_id,
        quantity: item.quantity,
      })),
    };

    // Enviamos el pedido a Printful
    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRINTFUL_KEY}`,
      },
      body: JSON.stringify(printfulOrder),
    });

    const data = await response.json();
    console.log("Printful response:", data);

    return res.status(200).json({ ok: true, printful: data });
  } catch (error) {
    console.error("Error creando pedido:", error);
    return res.status(500).json({ error: error.message });
  }
}
