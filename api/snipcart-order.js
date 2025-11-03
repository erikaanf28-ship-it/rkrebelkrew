export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const order = req.body.content;

    const printfulOrder = {
      recipient: {
        name: `${order.shippingAddressFirstName} ${order.shippingAddressLastName}`,
        address1: order.shippingAddressAddress1,
        city: order.shippingAddressCity,
        country_code: order.shippingAddressCountry,
        zip: order.shippingAddressPostalCode,
        phone: order.shippingAddressPhone,
        email: order.email,
      },
      items: order.items.map((item) => ({
        variant_id: item.id, // el ID del producto Printful
        quantity: item.quantity,
      })),
    };

    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
      body: JSON.stringify(printfulOrder),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Printful:", data);
      return res.status(400).json({ error: data });
    }

    res.status(200).json({ message: "Pedido enviado a Printful", data });
  } catch (err) {
    console.error("Error procesando pedido:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

  }
}
