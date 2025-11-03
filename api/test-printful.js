export default async function handler(req, res) {
  try {
    const token = process.env.PRINTFUL_TOKEN;

    if (!token) {
      return res.status(400).json({ error: "PRINTFUL_TOKEN no configurado" });
    }

    const response = await fetch("https://api.printful.com/store/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
