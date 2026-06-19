export default async function handler(req, res) {
    const { text } = req.query;
    if (!text) return res.status(400).send('Texto ausente');

    // Monta a URL do Google Tradutor
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encodeURIComponent(text)}`;

    try {
        const googleRes = await fetch(url);
        if (!googleRes.ok) throw new Error('Falha no Google TTS');
        
        const arrayBuffer = await googleRes.arrayBuffer();
        
        // Retorna o áudio direto pro seu site
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(Buffer.from(arrayBuffer));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
