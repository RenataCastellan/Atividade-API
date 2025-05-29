const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET = 'minha_chave_secreta';

app.use(cors());
app.use(bodyParser.json());

const usuario = { email: 'user@exemplo.com', senha: '123456' };

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (email === usuario.email && senha === usuario.senha) {
        const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

app.get('/status', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.json({ authenticated: false });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.json({ authenticated: false });
        }
        res.json({ authenticated: true });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
