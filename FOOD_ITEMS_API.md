# API Aliments Individuels - NutriScan

## Vue d'ensemble

Cette API permet de gérer une **base de données personnalisée d'aliments** créée automatiquement à partir des scans de repas. Chaque aliment détecté dans un repas scanné est extrait et normalisé (100g pour les pesables, 1 unité pour les comptables) pour faciliter la réutilisation.

### Fonctionnement

1. **Extraction automatique** : Après chaque scan de repas, les aliments sont automatiquement extraits et ajoutés à la base personnelle de l'utilisateur
2. **Normalisation** : Les quantités sont normalisées (100g ou 1 unité) avec les valeurs nutritionnelles correspondantes
3. **Compteur d'utilisation** : Chaque fois qu'un aliment existant est détecté, son compteur d'utilisation est incrémenté
4. **Recherche et réutilisation** : L'utilisateur peut rechercher et réutiliser facilement ses aliments favoris

---

## Endpoints

### 1. Liste des aliments

Récupère la liste des aliments personnels de l'utilisateur.

**Endpoint** : `GET /api/food-items`

**Headers** :
```
Authorization: Bearer {token}
```

**Paramètres de requête** :
| Paramètre | Type   | Requis | Description |
|-----------|--------|--------|-------------|
| `per_page` | number | Non | Nombre de résultats par page (défaut: 20) |
| `search` | string | Non | Recherche par nom d'aliment |
| `source` | string | Non | Filtrer par source (`scan`, `manual`) |

**Exemple** :
```bash
curl -X GET "http://localhost:8000/api/food-items?search=poulet&per_page=10" \
  -H "Authorization: Bearer {token}"
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 7,
      "name": "Poulet grillé",
      "type": "pesable",
      "source": "scan",
      "reference_quantity": 100,
      "reference_unit": "g",
      "nutrition_per_reference": {
        "energy_kcal": 165,
        "proteins": 31,
        "carbohydrates": 0,
        "sugars": 0,
        "fat": 3.6,
        "saturated_fat": 1.0,
        "fiber": 0,
        "sodium": 0.08
      },
      "usage_count": 12,
      "last_used_at": "2026-02-23T10:30:00+01:00",
      "original_meal_id": 3,
      "notes": null,
      "created_at": "2026-02-10T08:15:00+01:00",
      "updated_at": "2026-02-23T10:30:00+01:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 45
  }
}
```

---

### 2. Liste de tous les aliments (tous utilisateurs)

Récupère la liste de tous les aliments de la base de données (tous utilisateurs confondus), regroupés et triés par popularité. Utile pour proposer des suggestions d'aliments lors de la création de repas.

**Endpoint** : `GET /api/food-items/all`

**Headers** :
```
Authorization: Bearer {token}
```

**Paramètres de requête** :
| Paramètre | Type   | Requis | Description |
|-----------|--------|--------|-------------|
| `per_page` | number | Non | Nombre de résultats par page (défaut: 50) |
| `search` | string | Non | Recherche par nom d'aliment |

**Exemple** :
```bash
curl -X GET "http://localhost:8000/api/food-items/all?search=poulet" \
  -H "Authorization: Bearer {token}"
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "data": [
    {
      "name": "Poulet grillé",
      "type": "pesable",
      "reference_quantity": 100,
      "reference_unit": "g",
      "nutrition_per_reference": {
        "energy_kcal": 165,
        "proteins": 31,
        "carbohydrates": 0,
        "sugars": 0,
        "fat": 3.6,
        "saturated_fat": 1.0,
        "fiber": 0,
        "sodium": 0.08
      },
      "total_usage": 145
    },
    {
      "name": "Riz blanc",
      "type": "pesable",
      "reference_quantity": 100,
      "reference_unit": "g",
      "nutrition_per_reference": {
        "energy_kcal": 130,
        "proteins": 2.7,
        "carbohydrates": 28,
        "sugars": 0.1,
        "fat": 0.3,
        "saturated_fat": 0.1,
        "fiber": 0.4,
        "sodium": 0.01
      },
      "total_usage": 132
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 50,
    "total": 128
  }
}
```

**Note** : Les aliments sont regroupés par nom et type, avec un compteur `total_usage` qui agrège l'utilisation par tous les utilisateurs. Cela permet de voir les aliments les plus populaires dans toute la communauté.

---

### 3. Aliments les plus utilisés (personnels)

Récupère les aliments les plus fréquemment utilisés.

**Endpoint** : `GET /api/food-items/most-used`

**Headers** :
```
Authorization: Bearer {token}
```

**Paramètres de requête** :
| Paramètre | Type   | Requis | Description |
|-----------|--------|--------|-------------|
| `limit` | number | Non | Nombre d'aliments (défaut: 10, max: 50) |

**Exemple** :
```bash
curl -X GET "http://localhost:8000/api/food-items/most-used?limit=5" \
  -H "Authorization: Bearer {token}"
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Poulet grillé",
      "type": "pesable",
      "reference_quantity": 100,
      "reference_unit": "g",
      "nutrition_per_reference": {...},
      "usage_count": 25
    },
    {
      "id": 5,
      "name": "Riz basmati",
      "type": "pesable",
      "reference_quantity": 100,
      "reference_unit": "g",
      "nutrition_per_reference": {...},
      "usage_count": 18
    }
  ]
}
```

---

### 4. Aliments récemment utilisés

Récupère les aliments utilisés récemment.

**Endpoint** : `GET /api/food-items/recently-used`

**Headers** :
```
Authorization: Bearer {token}
```

**Paramètres de requête** :
| Paramètre | Type   | Requis | Description |
|-----------|--------|--------|-------------|
| `limit` | number | Non | Nombre d'aliments (défaut: 10, max: 50) |

**Réponse (200 OK)** : Même structure que les aliments les plus utilisés.

---

### 5. Détails d'un aliment

Récupère les détails complets d'un aliment.

**Endpoint** : `GET /api/food-items/{id}`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 7,
    "name": "Poulet grillé",
    "type": "pesable",
    "source": "scan",
    "reference_quantity": 100,
    "reference_unit": "g",
    "nutrition_per_reference": {
      "energy_kcal": 165,
      "proteins": 31,
      "carbohydrates": 0,
      "sugars": 0,
      "fat": 3.6,
      "saturated_fat": 1.0,
      "fiber": 0,
      "sodium": 0.08
    },
    "usage_count": 12,
    "last_used_at": "2026-02-23T10:30:00+01:00",
    "original_meal_id": 3,
    "notes": null,
    "created_at": "2026-02-10T08:15:00+01:00",
    "updated_at": "2026-02-23T10:30:00+01:00"
  }
}
```

**Erreur (404 Not Found)** :
```json
{
  "success": false,
  "message": "Aliment non trouvé."
}
```

---

### 6. Calculer les nutriments pour une quantité

Calcule les valeurs nutritionnelles pour une quantité spécifique d'un aliment.

**Endpoint** : `POST /api/food-items/{id}/calculate`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** :
```json
{
  "quantity": 150
}
```

**Exemple** :
```bash
curl -X POST "http://localhost:8000/api/food-items/1/calculate" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 150}'
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "data": {
    "food_item": {
      "id": 1,
      "name": "Poulet grillé",
      "type": "pesable",
      "reference_quantity": 100,
      "reference_unit": "g"
    },
    "requested_quantity": 150,
    "requested_unit": "g",
    "nutrition": {
      "energy_kcal": 247.5,
      "proteins": 46.5,
      "carbohydrates": 0,
      "sugars": 0,
      "fat": 5.4,
      "saturated_fat": 1.5,
      "fiber": 0,
      "sodium": 0.12
    }
  }
}
```

---

### 7. Supprimer un aliment

Supprime un aliment de la base personnelle.

**Endpoint** : `DELETE /api/food-items/{id}`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "message": "Aliment supprimé avec succès."
}
```

---

### 8. Statistiques des aliments

Récupère les statistiques sur la base d'aliments personnelle.

**Endpoint** : `GET /api/food-items/statistics`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "data": {
    "total_food_items": 45,
    "from_scan": 40,
    "from_manual": 5
  }
}
```

---

## Structure des données

### Objet FoodItem

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | Identifiant unique |
| `user_id` | number | ID de l'utilisateur propriétaire |
| `name` | string | Nom de l'aliment |
| `type` | string | Type : `pesable` (g, ml) ou `comptable` (pièce, tranche) |
| `source` | string | Source : `scan` (extrait d'un repas) ou `manual` (ajout manuel) |
| `reference_quantity` | number | Quantité de référence (100 pour pesable, 1 pour comptable) |
| `reference_unit` | string | Unité de référence (`g`, `ml`, `pièce`, etc.) |
| `nutrition_per_reference` | object | Valeurs nutritionnelles pour la quantité de référence |
| `usage_count` | number | Nombre de fois que l'aliment a été détecté/utilisé |
| `last_used_at` | datetime | Date de dernière utilisation |
| `original_meal_id` | number | ID du repas d'origine (si source = scan) |
| `notes` | string | Notes optionnelles |

### Valeurs nutritionnelles (`nutrition_per_reference`)

| Champ | Type | Unité | Description |
|-------|------|-------|-------------|
| `energy_kcal` | number | kcal | Calories |
| `proteins` | number | g | Protéines |
| `carbohydrates` | number | g | Glucides |
| `sugars` | number | g | Sucres |
| `fat` | number | g | Lipides |
| `saturated_fat` | number | g | Graisses saturées |
| `fiber` | number | g | Fibres |
| `sodium` | number | g | Sodium |

---

## Normalisation des quantités

### Aliments pesables (type = `pesable`)
- **Quantité de référence** : 100g
- Les valeurs nutritionnelles sont calculées pour 100g
- Unité : `g` (grammes)

**Exemple** : Si un repas contient "150g de poulet" avec 240 kcal, l'aliment stocké aura :
- `reference_quantity`: 100
- `reference_unit`: "g"
- `nutrition_per_reference.energy_kcal`: 160 (240 × 100/150)

### Aliments comptables (type = `comptable`)
- **Quantité de référence** : 1 unité
- Les valeurs nutritionnelles sont calculées pour 1 unité
- Unité : `pièce`, `tranche`, `cuillère`, etc.

**Exemple** : Si un repas contient "2 œufs" avec 140 kcal total, l'aliment stocké aura :
- `reference_quantity`: 1
- `reference_unit`: "pièce"
- `nutrition_per_reference.energy_kcal`: 70 (140 / 2)

---

## Cas d'usage

### 1. Créer un repas avec des aliments favoris
1. Récupérer les aliments les plus utilisés : `GET /api/food-items/most-used`
2. Pour chaque aliment, calculer les nutriments pour la quantité souhaitée : `POST /api/food-items/{id}/calculate`
3. Créer un repas manuel avec ces données : `POST /api/meals/add-manual`

### 2. Rechercher un aliment spécifique
```bash
GET /api/food-items?search=poulet
```

### 3. Construire une bibliothèque d'aliments
- Les aliments sont automatiquement extraits après chaque scan de repas
- Pas besoin d'action manuelle : la base se construit au fil des scans
- Les aliments fréquents remontent naturellement via `usage_count`
