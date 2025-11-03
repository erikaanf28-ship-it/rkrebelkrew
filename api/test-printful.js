export default async function handler(req, res) {
  try {
    const token = process.env.PRINTFUL_TOKEN;

    const response = await fetch('https://api.printful.com/store', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
}
