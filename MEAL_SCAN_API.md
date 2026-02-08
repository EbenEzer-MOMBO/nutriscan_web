# API de Scan d'Images de Repas - NutriScan

## Vue d'ensemble

Cette API permet de scanner des images de repas en utilisant OpenAI Vision (GPT-4o) pour identifier automatiquement les aliments, estimer les quantités et calculer les valeurs nutritionnelles complètes.

## Configuration

### Variables d'environnement

Ajoutez votre clé API OpenAI dans le fichier `.env` :

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=1500
OPENAI_TEMPERATURE=0.2
```

### Stockage des images

Les images sont automatiquement stockées dans Cloudflare R2 dans le dossier `meals/user-{id}/`.

---

## Endpoints

### 1. Scanner un repas

Analyse une image de repas et retourne les aliments détectés avec leurs valeurs nutritionnelles.

**Endpoint** : `POST /api/meals/scan`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body** :
- `image` (file, required) : Image du repas (JPEG, PNG, JPG, WebP, max 10MB)
- `meal_type` (string, optional) : Type de repas (`breakfast`, `lunch`, `dinner`, `snack`)
- `notes` (string, optional) : Notes personnelles (max 1000 caractères)

**Exemple de requête** :
```bash
curl -X POST http://localhost:8000/api/meals/scan \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/meal.jpg" \
  -F "meal_type=lunch" \
  -F "notes=Déjeuner au restaurant"
```

**Réponse (201 Created)** :
```json
{
  "success": true,
  "message": "Repas analysé avec succès.",
  "data": {
    "id": 1,
    "image_url": "https://fls-xxx.laravel.cloud/meals/user-1/uuid.jpg",
    "scanned_at": "2026-02-08T14:30:00+01:00",
    "meal_type": "lunch",
    "notes": "Déjeuner au restaurant",
    "foods_detected": [
      {
        "name": "Cuisse de poulet grillée",
        "type": "comptable",
        "quantity_display": "2 pièces",
        "quantity_value": 2,
        "quantity_unit": "pièce",
        "estimated_weight_grams": 200,
        "confidence": "high",
        "nutrition": {
          "energy_kcal": 380,
          "proteins": 38,
          "carbohydrates": 0,
          "sugars": 0,
          "fat": 24,
          "saturated_fat": 6.8,
          "fiber": 0,
          "sodium": 0.3
        }
      },
      {
        "name": "Riz blanc cuit",
        "type": "pesable",
        "quantity_display": "environ 150g",
        "quantity_value": 150,
        "quantity_unit": "g",
        "estimated_weight_grams": 150,
        "confidence": "medium",
        "nutrition": {
          "energy_kcal": 195,
          "proteins": 4,
          "carbohydrates": 43,
          "sugars": 0.1,
          "fat": 0.3,
          "saturated_fat": 0.1,
          "fiber": 0.6,
          "sodium": 0.01
        }
      }
    ],
    "nutrition_summary": {
      "energy_kcal": 575,
      "proteins": 42,
      "carbohydrates": 43,
      "sugars": 0.1,
      "fat": 24.3,
      "saturated_fat": 6.9,
      "fiber": 0.6,
      "sodium": 0.31
    },
    "total_calories": 575,
    "foods_count": 2,
    "analysis_notes": "Repas équilibré avec bonne source de protéines."
  }
}
```

**Erreurs possibles** :
- `422 Unprocessable Entity` : Image invalide ou analyse impossible
- `500 Internal Server Error` : Erreur serveur

---

### 2. Historique des repas

Récupère l'historique des repas scannés de l'utilisateur.

**Endpoint** : `GET /api/meals/history`

**Headers** :
```
Authorization: Bearer {token}
```

**Paramètres de requête** :
- `per_page` (int, optional) : Nombre de résultats par page (défaut: 20)
- `meal_type` (string, optional) : Filtrer par type (`breakfast`, `lunch`, `dinner`, `snack`)
- `start_date` (date, optional) : Date de début (format: YYYY-MM-DD)
- `end_date` (date, optional) : Date de fin (format: YYYY-MM-DD)

**Exemple** :
```bash
GET /api/meals/history?meal_type=lunch&per_page=10
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "image_url": "https://...",
      "scanned_at": "2026-02-08T14:30:00+01:00",
      "meal_type": "lunch",
      "total_calories": 575,
      "foods_count": 2
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

---

### 3. Détails d'un repas

Récupère les détails complets d'un repas scanné.

**Endpoint** : `GET /api/meals/{id}`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200 OK)** : Même structure que l'endpoint de scan

**Erreurs** :
- `404 Not Found` : Repas non trouvé

---

### 4. Mettre à jour un repas

Permet de modifier les quantités, le type de repas ou les notes.

**Endpoint** : `PUT /api/meals/{id}`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** :
```json
{
  "foods_detected": [
    {
      "name": "Cuisse de poulet grillée",
      "type": "comptable",
      "quantity_value": 3,
      "quantity_unit": "pièce",
      "estimated_weight_grams": 300,
      "nutrition": {
        "energy_kcal": 570,
        "proteins": 57,
        "carbohydrates": 0,
        "fat": 36
      }
    }
  ],
  "meal_type": "dinner",
  "notes": "Quantité ajustée"
}
```

**Réponse (200 OK)** : Repas mis à jour avec nutrition recalculée

---

### 5. Supprimer un repas

Supprime un repas de l'historique et son image associée.

**Endpoint** : `DELETE /api/meals/{id}`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "message": "Repas supprimé avec succès."
}
```

---

### 6. Statistiques quotidiennes

Récupère les statistiques nutritionnelles pour une journée.

**Endpoint** : `GET /api/meals/statistics/daily`

**Headers** :
```
Authorization: Bearer {token}
```

**Paramètres** :
- `date` (string, optional) : Date au format YYYY-MM-DD (défaut: aujourd'hui)

**Exemple** :
```bash
GET /api/meals/statistics/daily?date=2026-02-08
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "date": "2026-02-08",
  "data": {
    "total_meals": 3,
    "total_calories": 1850,
    "total_proteins": 95,
    "total_carbohydrates": 180,
    "total_fat": 65,
    "average_calories_per_meal": 616.7
  }
}
```

---

### 7. Statistiques hebdomadaires

Récupère les statistiques nutritionnelles pour une semaine.

**Endpoint** : `GET /api/meals/statistics/weekly`

**Headers** :
```
Authorization: Bearer {token}
```

**Paramètres** :
- `start_date` (string, optional) : Date de début (défaut: début de semaine)
- `end_date` (string, optional) : Date de fin (défaut: fin de semaine)

**Réponse (200 OK)** :
```json
{
  "success": true,
  "period": {
    "start_date": "2026-02-03",
    "end_date": "2026-02-09"
  },
  "data": {
    "total_meals": 21,
    "total_calories": 12950,
    "total_proteins": 665,
    "total_carbohydrates": 1260,
    "total_fat": 455,
    "average_calories_per_meal": 616.7,
    "days_count": 7
  }
}
```

---

## Types d'aliments

L'API distingue deux types d'aliments :

### Pesable
Aliments mesurés en grammes (poids modifiable côté frontend) :
- Riz, pâtes, semoule
- Légumes, fruits
- Sauces, condiments
- Purées, soupes

**Exemple** :
```json
{
  "type": "pesable",
  "quantity_value": 150,
  "quantity_unit": "g"
}
```

### Comptable
Aliments comptés en pièces/unités (nombre modifiable côté frontend) :
- Cuisses de poulet, morceaux de viande
- Œufs
- Tranches de pain
- Fruits entiers (pomme, orange)

**Exemple** :
```json
{
  "type": "comptable",
  "quantity_value": 2,
  "quantity_unit": "pièce"
}
```

---

## Modification des quantités côté frontend

Le frontend peut modifier les quantités et recalculer automatiquement la nutrition :

1. **Pour les aliments pesables** : Modifier `quantity_value` (en grammes)
2. **Pour les aliments comptables** : Modifier `quantity_value` (nombre de pièces)
3. Envoyer les données mises à jour via `PUT /api/meals/{id}`
4. L'API recalcule automatiquement les valeurs nutritionnelles

---

## Valeurs nutritionnelles

Toutes les valeurs nutritionnelles sont calculées pour la portion estimée :

- `energy_kcal` : Énergie en kilocalories
- `proteins` : Protéines en grammes
- `carbohydrates` : Glucides totaux en grammes
- `sugars` : Sucres en grammes
- `fat` : Lipides totaux en grammes
- `saturated_fat` : Graisses saturées en grammes
- `fiber` : Fibres en grammes
- `sodium` : Sodium en grammes

---

## Niveau de confiance

Chaque aliment détecté a un niveau de confiance :

- `high` : Identification très précise
- `medium` : Identification probable mais avec incertitude
- `low` : Identification incertaine

---

## Limites et considérations

1. **Précision** : L'estimation des portions a une marge d'erreur moyenne de ~46g
2. **Aliments cachés** : Les ingrédients non visibles ne sont pas détectés
3. **Cuisine culturelle** : Meilleure précision pour les plats standards
4. **Qualité d'image** : Images claires et bien éclairées donnent de meilleurs résultats
5. **Coût** : ~0.008$ par scan avec GPT-4o

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Ressource créée |
| 401 | Non authentifié |
| 404 | Ressource non trouvée |
| 422 | Validation échouée |
| 500 | Erreur serveur |

---

## Exemples d'utilisation

### Scanner un repas simple
```bash
curl -X POST http://localhost:8000/api/meals/scan \
  -H "Authorization: Bearer {token}" \
  -F "image=@breakfast.jpg" \
  -F "meal_type=breakfast"
```

### Récupérer les repas du jour
```bash
curl -X GET "http://localhost:8000/api/meals/history?start_date=2026-02-08&end_date=2026-02-08" \
  -H "Authorization: Bearer {token}"
```

### Modifier une quantité
```bash
curl -X PUT http://localhost:8000/api/meals/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "foods_detected": [
      {
        "name": "Riz blanc cuit",
        "type": "pesable",
        "quantity_value": 200,
        "quantity_unit": "g",
        "estimated_weight_grams": 200,
        "nutrition": {...}
      }
    ]
  }'
```

---

## Prochaines étapes

1. Obtenir une clé API OpenAI
2. Configurer `OPENAI_API_KEY` dans `.env`
3. Tester avec des images réelles
4. Intégrer dans l'application mobile
5. Optimiser le prompt selon les retours utilisateurs
