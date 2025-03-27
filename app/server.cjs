const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require("fs");
const cors = require('cors');
const dataDir = path.join(__dirname, "../data");
const filePath = path.join(dataDir, "users.json");

const app = express();
const PORT = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Activer CORS pour toutes les origines
app.use(cors());

// Servir les fichiers statiques (index.html et app.js)
app.use(express.static(path.join(__dirname, '..'))); 

app.get('/', (req, res) => {
    // res.send('<h1>Serveur Express en ligne 🚀</h1>');
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.get('/favicon.ico', (req, res) => res.status(204));
// API pour récupérer les données
app.post('/fetch-data', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        // const browser = await puppeteer.launch({ headless: true });
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
        const page = await browser.newPage();
        const loginUrl = "https://hub.zone01normandie.org/emargement/index.php";

        await page.goto(loginUrl, { waitUntil: 'networkidle2' });

        await page.type('input[name="pseudo"]', username);
        await page.type('input[name="password"]', password);

        await Promise.all([
            page.click('input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

        if (page.url() === loginUrl) {
            throw new Error("Échec de la connexion");
        }

        const tdValue = await page.evaluate(() => {
            const tbody = document.getElementById("tbodyStats");
            return tbody ? tbody.querySelector("tr td:nth-child(2)")?.textContent.trim() : null;
        });

        await browser.close();
        // Charger le fichier JSON s'il existe, sinon créer un tableau vide
        // Vérifier si le dossier "data/" existe, sinon le créer
        // if (!fs.existsSync(dataDir)) {
        //     fs.mkdirSync(dataDir, { recursive: true });
        // }

        // Charger le fichier JSON s'il existe, sinon créer un tableau vide
        // let users = [];
        // if (fs.existsSync(filePath)) {
        //     const fileData = fs.readFileSync(filePath, "utf-8");
        //     users = JSON.parse(fileData);
        // }

        // // Vérifier si l'utilisateur existe déjà
        // const userExists = users.some(user => user.username === username && user.password === password);

        // if (!userExists) {
        //     users.push({ username, password });
        //     fs.writeFileSync(filePath, JSON.stringify(users, null, 4), "utf-8");
        //     console.log("Utilisateur enregistré !");
        // } else {
        //     console.log("L'utilisateur existe déjà.");
        // }
        res.json({ data: tdValue });

    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
