export default async (request, context) => {
  try {
    // 1. Ambil 4 foto dari app lu
    const { foto1, foto2, foto3, foto4 } = await request.json();
    
    // 2. Cek API Key udah ada apa belum
    const apiKey = Netlify.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key belum diset" }), { status: 500 });
    }

    // 3. Panggil Gemini buat analisa
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Ini 4 foto sudut sebidang tanah. Di foto pertama ada kertas A4 sebagai skala 21x29.7cm. Hitung panjang, lebar, dan luas tanah dalam meter. Balas hanya dalam format JSON: {panjang: angka, lebar: angka, luas: angka, bentuk: 'teks'}. Jangan pake markdown." },
            { inline_data: { mime_type: "image/jpeg", data: foto1.split(',')[1] } },
            { inline_data: { mime_type: "image/jpeg", data: foto2.split(',')[1] } },
            { inline_data: { mime_type: "image/jpeg", data: foto3.split(',')[1] } },
            { inline_data: { mime_type: "image/jpeg", data: foto4.split(',')[1] } }
          ]
        }]
      })
    });

    const data = await geminiRes.json();
    const textHasil = data.candidates[0].content.parts[0].text;
    const hasilUkuran = JSON.parse(textHasil);

    // 4. Kirim balik ke app Tanahin
    return new Response(JSON.stringify(hasilUkuran), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};