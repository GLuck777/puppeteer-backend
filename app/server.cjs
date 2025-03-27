const path = require('path');
const fs = require('fs');
const express = require('express');
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-core');
const executablePath = '/usr/bin/chromium';
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Vérification si Chromium est installé
const chromiumPath = '/usr/bin/chromium';  // Chemin typique sur un serveur Linux
if (!fs.existsSync(chromiumPath)) {
  console.error('Chromium n\'est pas installé sur le serveur.');
  process.exit(1);  // Arrêter le serveur si Chromium n'est pas disponible
}

// API pour récupérer les données
app.post('/fetch-data', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true, // ou 'new'
            executablePath, // Spécifie le chemin de Chrome/Chromium
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
            ],
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
        res.json({ data: tdValue });

    } catch (error) {
        console.error("Erreur dans la récupération des données:", error); // Affiche l'erreur ici
        res.status(500).json({ error: "Erreur serveur : " + error.message }); // Envoie l'erreur détaillée dans la réponse
    }
});

app.listen(PORT, () => {
    console.log(`Serveur API lancé sur http://localhost:${PORT}`);
});

       