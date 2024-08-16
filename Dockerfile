# Utilise l'image officielle de Node.js
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances de l'application
RUN npm install --production

# Copie tout le reste de l'application dans le conteneur
COPY . .

# Expose le port que ton application utilise
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
