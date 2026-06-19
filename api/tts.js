export default async function handler(req, res) {
    const { text } = req.query;
    if (!text) return res.status(400).send('Texto ausente');

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encodeURIComponent(text)}`;

    try {
        const googleRes = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        
        if (!googleRes.ok) throw new Error('Falha no Google TTS');
        
        const arrayBuffer = await googleRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Configurações estritas de cabeçalho para o navegador aceitar o áudio
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        return res.status(200).send(buffer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
