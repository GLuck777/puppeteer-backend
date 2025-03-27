Étapes pour déployer ton backend sur Render

    Créer un compte sur Render
    👉 https://render.com

    Lier ton dépôt GitHub

        Clique sur "New +" → "Web Service"

        Sélectionne ton repo GitHub contenant server.cjs

    Configurer ton backend

        Branch : choisis main (ou ta branche de travail)

        Runtime : Node.js

        Build Command : npm install

        Start Command : node server.cjs

        Region : prends la plus proche

    Déployer automatiquement 🚀

        Active Auto Deploy pour qu'à chaque push, Render redéploie ton backend

    Attendre le déploiement ⏳

        Render va builder et démarrer ton serveur

        À la fin, tu obtiendras une URL du type :

https://ton-backend.onrender.com
