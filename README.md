# Storefront WooCommerce React

Ce projet est un front-end React/Vite prêt à brancher sur votre back-office WooCommerce.

## Démarrage

1. Installez les dépendances : `npm install`
2. Lancez le serveur de dev : `npm run dev`
3. Consultez le site en developpement sur : `http://localhost:5173`

## Configuration API

Le front utilise la variable suivante :

- `VITE_API_URL` dans le fichier .env.production, c'est ici que vous renseignerez l'adresse du site woocommerce

## Build

`npm run build`

## Config wordpress

1. creez un sous domaine api.mondomain.com pour deployer wordpress/woocommerce.
2. créez un dossier nommé mu-plugins (au même niveau que le dossier themes et plugins).
3. Créez un fichier nommé api-cors-configuration.php à l'intérieur, et collez ce code dedans :

```php
<?php
if (!defined('ABSPATH')) {
    exit;
}
add_filter('allowed_http_origins', function($origins) {$origins[] = 'https://mondomaine.com';
    return $origins;
});
```
