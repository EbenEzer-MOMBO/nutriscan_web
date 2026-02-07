# API OpenFoodFacts - Documentation

## Endpoints Disponibles

Tous les endpoints nécessitent une authentification via le token Bearer (Sanctum).

### 1. Scanner un Produit

**Endpoint**: `POST /api/products/scan`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "barcode": "3017624010701"
}
```

**Réponse Succès (200)**:
```json
{
  "success": true,
  "message": "Produit scanné avec succès.",
  "data": {
    "id": 1,
    "barcode": "3017624010701",
    "product_name": "Nutella",
    "brands": "Ferrero",
    "quantity": "750g",
    "image_url": "https://images.openfoodfacts.org/...",
    "image_small_url": "https://images.openfoodfacts.org/...",
    "nutriscore_grade": "e",
    "nutriments": {
      "energy_kcal": 539,
      "energy_kj": 2255,
      "proteins": 6.3,
      "carbohydrates": 57.5,
      "sugars": 56.3,
      "fat": 30.9,
      "saturated_fat": 10.6,
      "fiber": 0,
      "sodium": 0.107,
      "salt": 0.268
    },
    "ingredients_text": "Sucre, huile de palme, NOISETTES 13%...",
    "allergens": "Noisettes, lait, soja",
    "allergens_tags": ["en:nuts", "en:milk", "en:soybeans"],
    "labels": "Sans gluten",
    "labels_tags": ["en:gluten-free"],
    "categories": "Pâtes à tartiner",
    "serving_size": "15g",
    "nova_group": 4,
    "ecoscore_grade": "d",
    "scanned_at": "2026-02-07T22:15:30+00:00",
    "created_at": "2026-02-07T22:15:30+00:00"
  }
}
```

**Réponse Erreur - Produit Non Trouvé (404)**:
```json
{
  "success": false,
  "message": "Produit non trouvé. Vérifiez le code-barre ou réessayez plus tard.",
  "barcode": "0000000000000"
}
```

**Réponse Erreur - Validation (422)**:
```json
{
  "message": "Le code-barre doit contenir entre 8 et 13 chiffres.",
  "errors": {
    "barcode": [
      "Le code-barre doit contenir entre 8 et 13 chiffres."
    ]
  }
}
```

---

### 2. Historique des Scans

**Endpoint**: `GET /api/products/scan-history`

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `per_page` (optionnel): Nombre de résultats par page (défaut: 20)
- `page` (optionnel): Numéro de page (défaut: 1)
- `search` (optionnel): Recherche par nom de produit ou marque

**Exemple**:
```
GET /api/products/scan-history?per_page=10&page=1&search=nutella
```

**Réponse Succès (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "barcode": "3017624010701",
      "product_name": "Nutella",
      "brands": "Ferrero",
      "image_url": "https://...",
      "nutriments": { ... },
      "scanned_at": "2026-02-07T22:15:30+00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 47
  }
}
```

---

### 3. Supprimer un Scan de l'Historique

**Endpoint**: `DELETE /api/products/scan-history/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**Réponse Succès (200)**:
```json
{
  "success": true,
  "message": "Produit supprimé de l'historique."
}
```

**Réponse Erreur (404)**:
```json
{
  "success": false,
  "message": "Produit non trouvé dans votre historique."
}
```

---

### 4. Vider Tout l'Historique

**Endpoint**: `DELETE /api/products/scan-history`

**Headers**:
```
Authorization: Bearer {token}
```

**Réponse Succès (200)**:
```json
{
  "success": true,
  "message": "Historique vidé avec succès. 15 produit(s) supprimé(s)."
}
```

---

### 5. Statistiques de Scan

**Endpoint**: `GET /api/products/scan-statistics`

**Headers**:
```
Authorization: Bearer {token}
```

**Réponse Succès (200)**:
```json
{
  "success": true,
  "data": {
    "total_scans": 127,
    "scans_this_month": 45,
    "scans_this_week": 12,
    "scans_today": 3
  }
}
```

---

## Codes-Barres de Test

Voici quelques codes-barres valides pour tester l'API :

| Produit | Code-Barre | Description |
|---------|------------|-------------|
| Nutella Ferrero | `3017624010701` | Pâte à tartiner |
| Coca-Cola | `5449000000996` | Boisson gazeuse |
| Danone Activia | `3033490001094` | Yaourt |
| Kinder Bueno | `8000500037447` | Chocolat |
| Oasis Tropical | `3124480186607` | Boisson aux fruits |
| Lu Petit Écolier | `3017760000017` | Biscuits |

---

## Informations Nutritionnelles

Toutes les valeurs nutritionnelles sont données **pour 100g de produit**.

### Champs Disponibles

- `energy_kcal`: Énergie en kilocalories
- `energy_kj`: Énergie en kilojoules
- `proteins`: Protéines (g)
- `carbohydrates`: Glucides totaux (g)
- `sugars`: Sucres (g)
- `fat`: Lipides totaux (g)
- `saturated_fat`: Acides gras saturés (g)
- `fiber`: Fibres (g)
- `sodium`: Sodium (g)
- `salt`: Sel (g)

### Calcul pour une Portion

Pour calculer les valeurs nutritionnelles d'une portion spécifique :

```javascript
// Exemple: portion de 30g
const portionSize = 30; // grammes
const nutriments = response.data.nutriments;

const portionCalories = (nutriments.energy_kcal * portionSize) / 100;
const portionProteins = (nutriments.proteins * portionSize) / 100;
// etc.
```

---

## Nutri-Score

Le Nutri-Score est une note de A (meilleur) à E (moins bon) qui évalue la qualité nutritionnelle du produit.

- **A**: Très bonne qualité nutritionnelle (vert foncé)
- **B**: Bonne qualité nutritionnelle (vert clair)
- **C**: Qualité nutritionnelle moyenne (jaune)
- **D**: Qualité nutritionnelle faible (orange)
- **E**: Très faible qualité nutritionnelle (rouge)

---

## Nova Group

Le groupe NOVA classe les aliments selon leur degré de transformation :

- **1**: Aliments non transformés ou minimalement transformés
- **2**: Ingrédients culinaires transformés
- **3**: Aliments transformés
- **4**: Produits alimentaires ultra-transformés

---

## Gestion du Cache

Les résultats de l'API OpenFoodFacts sont mis en cache pendant **24 heures** pour améliorer les performances et réduire la charge sur l'API externe.

Le cache est automatiquement géré par le système. Si vous scannez le même produit plusieurs fois dans les 24 heures, les données seront récupérées depuis le cache.

---

## Gestion des Erreurs

### Codes d'Erreur HTTP

- **200**: Succès
- **404**: Produit non trouvé
- **422**: Erreur de validation (code-barre invalide)
- **401**: Non authentifié
- **500**: Erreur serveur

### Messages d'Erreur Courants

1. **"Le code-barre doit contenir entre 8 et 13 chiffres."**
   - Le format du code-barre est invalide
   - Vérifiez que le code-barre ne contient que des chiffres

2. **"Produit non trouvé. Vérifiez le code-barre ou réessayez plus tard."**
   - Le produit n'existe pas dans la base OpenFoodFacts
   - Le code-barre est peut-être incorrect
   - L'API OpenFoodFacts est temporairement indisponible

3. **"Unauthenticated."**
   - Le token d'authentification est manquant ou invalide
   - Connectez-vous à nouveau pour obtenir un nouveau token

---

## Exemples d'Utilisation

### Exemple avec cURL

```bash
# Scanner un produit
curl -X POST http://localhost:8000/api/products/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"barcode": "3017624010701"}'

# Récupérer l'historique
curl -X GET "http://localhost:8000/api/products/scan-history?per_page=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Statistiques
curl -X GET http://localhost:8000/api/products/scan-statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exemple avec JavaScript (Fetch)

```javascript
// Scanner un produit
async function scanProduct(barcode) {
  const response = await fetch('http://localhost:8000/api/products/scan', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ barcode }),
  });
  
  const data = await response.json();
  return data;
}

// Utilisation
const result = await scanProduct('3017624010701');
console.log(result.data.product_name); // "Nutella"
console.log(result.data.nutriments.energy_kcal); // 539
```

---

## Notes Importantes

1. **Authentification Requise**: Tous les endpoints nécessitent un token Bearer valide
2. **Cache**: Les résultats sont mis en cache pendant 24h
3. **Historique Unique**: Un utilisateur ne peut avoir qu'un seul enregistrement par code-barre (le dernier scan écrase l'ancien)
4. **Valeurs Nutritionnelles**: Toutes les valeurs sont pour 100g de produit
5. **API Externe**: Les données proviennent d'OpenFoodFacts, une base de données collaborative
