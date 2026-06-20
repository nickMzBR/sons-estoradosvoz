export default async function handler(req, res) {
    // 1. Pega o texto enviado pelo seu HTML
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: 'Por favor, forneça um texto.' });
    }

    try {
        // 2. Monta a URL oficial do Google TTS
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encodeURIComponent(text)}`;

        // 3. Faz o servidor do Vercel baixar o áudio (o Google não bloqueia o Vercel)
        const response = await fetch(ttsUrl);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Erro ao buscar áudio no Google' });
        }

        // 4. Transforma o áudio em um Buffer de memória
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 5. Devolve o áudio limpinho para o seu HTML processar e amplificar
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache para ficar ultra rápido
        
        return res.status(200).send(buffer);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno no servidor da API' });
    }
}
