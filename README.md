![Logo Mon Vieux Grimoire](./Logo_README.png)

# Site de référencement et de notation de livres

L'API backend de Mon Vieux Grimoire permet de gérer une collection de livres avec MongoDB. Les utilisateurs peuvent créer un compte, se connecter et effectuer des opérations CRUD sur les livres telles que l'ajout, la suppression et la modification des livres (À noter que, conformément aux [spécifications techniques](https://github.com/Michael-Boethas/p6-mon-vieux-grimoire/blob/main/Spécifications_techniques_API.pdf) du projet, un utilisateur ne peut noter un même livre qu'une seule fois et une note ne peut être modifiée).  
Le frontend hébergé sur ce dépôt est fourni par [Openclassrooms](https://openclassrooms.com/fr/).

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Endpoints de l'API](#endpoints-de-lapi)
- [Licence](#licence)

## Fonctionnalités

- Inscription et connexion/déconnexion avec authentification. Gestion de session avec token d'accès, token d'actualisation et blacklist.
- Opérations CRUD : Les utilisateurs peuvent créer, noter, mettre à jour et supprimer des livres.
- Notation des livres, la note moyenne est calculée automatiquement.
- Optimisation des images téléchargées.

## Installation

### Structure du projet

```plaintext
├── app.js
├── config
│   └── endpoints.js
├── controllers
│   ├── bookControllers.js
│   └── userControllers.js
├── docs
│   └── swagger.yaml
├── middleware
│   ├── authenticate.js
│   ├── imageOptimize.js
│   ├── imageUpload.js
│   ├── setHeaders.js
│   └── setRequestLimit.js
├── models
│   ├── BlacklistedToken.js
│   ├── Book.js
│   └── User.js
├── public
│   └── images
├── routes
│   └── routes.js
├── server.js
└── utils
    ├── logger.js
    └── utils.js
```

### Variables d'environnement

Créez un fichier `.env` dans la racine du projet et ajoutez les variables d'environnement suivantes :

```plaintext
NODE_ENV=production
PORT=
ALLOWED_ORIGIN_DOMAIN=
ALLOWED_ORIGIN_PORT=
MONGODB_CONNECTION_STRING=
ACCESS_JWT_SECRET_KEY=
REFRESH_JWT_SECRET_KEY=
IMAGES_DIR=public/images
```

### Clonez le dépôt

```bash
git clone https://github.com/Michael-Boethas/p6-mon-vieux-grimoire.git
cd p6-mon-vieux-grimoire
```

### Installation des dépendances

#### Prérequis

- Node.js: 20.16.0
- npm

#### Packages

- `bcrypt: 5.1.1`
- `cookie-parser: 1.4.7`
- `cors: 2.8.5`
- `dotenv: 16.4.5`
- `express: 4.19.2`
- `express-rate-limit: 7.4.0`
- `helmet: 7.1.0`
- `http-status: 1.7.4`
- `jsonwebtoken: 9.0.2`
- `mongoose: 8.5.2`
- `mongoose-unique-validator: 5.0.1`
- `multer: 1.4.5-lts.1`
- `sharp: 0.33.5`
- `swagger-ui-express: 5.0.1`
- `winston: 3.14.2`
- `yamljs: 0.3.0`

#### Commande d'installation

```bash
npm install bcrypt cookie-parser cors dotenv express express-rate-limit helmet http-status jsonwebtoken mongoose mongoose-unique-validator multer sharp swagger-ui-express winston yamljs
```

### Démarrez le serveur

```bash
npm start
```

## Utilisation

Frontend, Postman ou cURL.

## Endpoints de l'API

### Utilisateurs

- **Inscription** : `POST /api/auth/signup`
- **Connexion** : `POST /api/auth/login`
- **Actualisation des tokens** : `POST /api/auth/refresh-session`
- **Déconnexion** : `POST /api/auth/logout`
- **Désinscription** : `DELETE /api/auth/delete-account`

### Livres

- **Obtenir tous les livres** : `GET /api/books`
- **Obtenir un livre par ID** : `GET /api/books/:id`
- **Obtenir les livres les mieux notés** : `GET /api/books/bestrating`
- **Créer un nouveau livre** : `POST /api/books`
- **Mettre à jour un livre** : `PUT /api/books/:id`
- **Supprimer un livre** : `DELETE /api/books/:id`
- **Noter un livre** : `POST /api/books/:id/rating`

## Licence

Mon Vieux Grimoire ©
