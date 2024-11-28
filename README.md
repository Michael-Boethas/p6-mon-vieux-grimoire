<div>
    <img src="./Logo_README.png" alt="Logo Mon Vieux Grimoire" style="width: 100%; height: auto;">
</div>

<h1 style="color:   #b65b11  ; font-size:24px">Site de référencement et de notation de livres</h1>

<p>L'API backend de Mon Vieux Grimoire permet de gérer une collection de livres avec MongoDB. Les utilisateurs peuvent créer un compte, se connecter et effectuer des opérations CRUD sur les livres telles que l'ajout, la suppression et la modification des livres</p>

<h2 style="color:   #b65b11  ; font-size:24px">Table des matières</h2>
<ul>
    <li><a href="#features">Fonctionnalités</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Utilisation</a></li>
    <li><a href="#api-endpoints">Endpoints de l'API</a></li>
    <li><a href="#license">Licence</a></li>
</ul>

<h2 style="color:   #b65b11  ; font-size:24px" id="features">Fonctionnalités</h2>
<ul>
    <li>Inscription et connexion/déconnexion avec authentification, gestion de session avec token d'accès et token d'actualisation</li>
    <li>Opérations CRUD: Les utilisateurs peuvent créer, noter, mettre à jour et supprimer des livres.</li>
    <li>Notation des livres, la note moyenne est calculée automatiquement.</li>
    <li>Optimisation des images téléchargées.</li>
</ul>

<h2 style="color:   #b65b11  ; font-size:24px" id="installation">Installation</h2>

<h3 style="font-style:italic;"  id="project-structure">Structure du projet :</h3>

<pre><code>
├── app.js
├── config/
│   └── endpoints.js
├── controllers/
│   ├── bookControllers.js
│   └── userControllers.js
├── middleware/
│   ├── authenticate.js
│   ├── imageOptimize.js
│   ├── imageUpload.js
│   ├── setHeaders.js
│   └── setRequestLimit.js
├── models/
│   ├── book.js
│   └── user.js
├── public/
│   └── images/
├── routes/
│   └── routes.js
├── server.js
└── utils/
    ├── logger.js
    └── utils.js
</code></pre>

<h3 style="font-style:italic;"  id="environment-variables">Variables d'environnement :</h3>

<p>Créez un fichier <code>.env</code> dans la racine du projet et ajoutez les variables d'environnement suivantes :</p>

<pre><code>
NODE_ENV=production
PORT=
ALLOWED_ORIGIN_DOMAIN=
ALLOWED_ORIGIN_PORT=
MONGODB_CONNECTION_STRING=
ACCESS_JWT_SECRET_KEY=
SESSION_JWT_SECRET_KEY=
IMAGES_DIR=public/images

</code></pre>

<h3 style="font-style:italic;" >Clonez le dépôt :</h3>

<pre><code>
git clone https://github.com/Michael-Boethas/p6-mon-vieux-grimoire.git
cd p6-mon-vieux-grimoire
</code></pre>

<h3 style="font-style:italic;" >Installation des dépendances :</h3>

<ul>
    <li>Node.js: 20.16.0</li>
    <li>npm</li>
    <li>bcrypt: 5.1.1</li>
    <li>cookie-parser: 1.4.7</li>
    <li>cors: 2.8.5</li>
    <li>dotenv: 16.4.5</li>
    <li>express: 4.19.2</li>
    <li>express-rate-limit: 7.4.0</li>
    <li>helmet: 7.1.0</li>
    <li>http-status: 1.7.4</li>
    <li>jsonwebtoken: 9.0.2</li>
    <li>mongoose: 8.5.2</li>
    <li>mongoose-unique-validator: 5.0.1</li>
    <li>multer: 1.4.5-lts.1</li>
    <li>sharp: 0.33.5</li>
    <li>winston: 3.14.2</li>
</ul>

<pre><code>
npm install bcrypt cors dotenv express express-rate-limit helmet http-status jsonwebtoken cookie-parser mongoose mongoose-unique-validator multer sharp winston
</code></pre>

<p>Démarrez le serveur :</li>

<pre><code>
npm start
</code></pre>

<h2  style="color:   #b65b11  ; font-size:24px" id="usage">Utilisation</h2>
<p>Frontend, Postman ou cURL.</p>

<h2  style="color:   #b65b11  ; font-size:24px" id="api-endpoints">Endpoints de l'API</h2>

<h3 style="font-style:italic;" >Utilisateurs :</h3>
<ul>
    <li>Inscription : <code>POST /api/auth/signup</code></li>
    <li>Connexion : <code>POST /api/auth/login</code></li>
    <li>Déconnexion : <code>POST /api/auth/logout</code></li>
</ul>

<h3 style="font-style:italic;" >Livres :</h3>
<ul>
    <li>Obtenir tous les livres : <code>GET /api/books</code></li>
    <li>Obtenir un livre par ID : <code>GET /api/books/:id</code></li>
    <li>Obtenir les livres les mieux notés : <code>GET /api/books/bestrating</code></li>
    <li>Créer un nouveau livre : <code>POST /api/books</code></li>
    <li>Mettre à jour un livre : <code>PUT /api/books/:id</code></li>
    <li>Supprimer un livre : <code>DELETE /api/books/:id</code></li>
    <li>Noter un livre : <code>POST /api/books/:id/rating</code></li>
</ul>

<h2 style="color:   #b65b11  ; font-size:24px" id="license">Licence</h2>
<p>- Mon Vieux Grimoire ©</p>
