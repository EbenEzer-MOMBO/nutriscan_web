# API Journal de suivi - NutriScan

## Vue d'ensemble

Cette API permet de consulter le **journal de suivi nutritionnel** pour une journée : liste des repas scannés, totaux consommés (calories et macronutriments) et état d'atteinte des objectifs définis dans le profil utilisateur. Un endpoint **vue mensuelle** fournit le statut d'objectif pour chaque jour du mois afin d'alimenter un calendrier (ex. vert = objectif atteint, rouge = non atteint).

Le journal s'appuie sur les **repas scannés** ([API Scan de repas](MEAL_SCAN_API.md)) et sur les **objectifs quotidiens** du profil ([API Profil](PROFILE_API.md)). Si l'utilisateur n'a pas de profil, les champs `goals` et `goal_status` sont à `null`.

---

## Endpoints

### 1. Récupérer le journal (du jour ou d'une date)

Retourne le journal de suivi pour la date demandée : repas du jour, totaux consommés, objectifs du profil (si existant) et statut d'atteinte des objectifs.

**Endpoint** : `GET /api/journal`

**Headers** :
```
Authorization: Bearer {token}
Accept: application/json
```

**Paramètres de requête** :
| Paramètre | Type   | Requis | Description |
|-----------|--------|--------|-------------|
| `date`    | string | Non    | Date au format `YYYY-MM-DD`. Par défaut : date du jour. |

**Exemple — Journal du jour** :
```bash
curl -X GET "http://localhost:8000/api/journal" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**Exemple — Journal d'un jour spécifique** :
```bash
curl -X GET "http://localhost:8000/api/journal?date=2026-02-23" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**Réponse (200 OK) — Avec profil** :
```json
{
  "success": true,
  "date": "2026-02-23",
  "meals": [
    {
      "id": 1,
      "image_url": "https://...",
      "scanned_at": "2026-02-23T08:15:00+01:00",
      "meal_type": "breakfast",
      "notes": null,
      "foods_detected": [
        {
          "name": "Pain complet",
          "type": "pesable",
          "quantity_display": "2 tranches",
          "quantity_value": 80,
          "quantity_unit": "g",
          "estimated_weight_grams": 80,
          "confidence": "high",
          "nutrition": {
            "energy_kcal": 196,
            "proteins": 7.2,
            "carbohydrates": 36.8,
            "sugars": 1.6,
            "fat": 2.4,
            "saturated_fat": 0.5,
            "fiber": 4,
            "sodium": 0.36
          }
        }
      ],
      "nutrition_summary": {
        "energy_kcal": 196,
        "proteins": 7.2,
        "carbohydrates": 36.8,
        "sugars": 1.6,
        "fat": 2.4,
        "saturated_fat": 0.5,
        "fiber": 4,
        "sodium": 0.36
      },
      "total_calories": 196,
      "foods_count": 1,
      "analysis_notes": null
    }
  ],
  "consumed": {
    "total_calories": 1850.5,
    "total_proteins": 95.2,
    "total_carbohydrates": 210.0,
    "total_fat": 72.3,
    "total_meals": 3
  },
  "goals": {
    "calories": 2200,
    "proteins": 110.0,
    "carbohydrates": 275.0,
    "fat": 73.3
  },
  "goal_status": {
    "calories_reached": true,
    "proteins_reached": false,
    "carbs_reached": true,
    "fat_reached": true,
    "overall_reached": false
  }
}
```

**Réponse (200 OK) — Sans profil** :

Si l'utilisateur n'a pas encore créé de profil, les objectifs et le statut ne sont pas calculés :

```json
{
  "success": true,
  "date": "2026-02-23",
  "meals": [...],
  "consumed": {
    "total_calories": 1850.5,
    "total_proteins": 95.2,
    "total_carbohydrates": 210.0,
    "total_fat": 72.3,
    "total_meals": 3
  },
  "goals": null,
  "goal_status": null
}
```

**Réponse (200 OK) — Jour sans repas** :

```json
{
  "success": true,
  "date": "2026-02-23",
  "meals": [],
  "consumed": {
    "total_calories": 0,
    "total_proteins": 0,
    "total_carbohydrates": 0,
    "total_fat": 0,
    "total_meals": 0
  },
  "goals": { "calories": 2200, "proteins": 110.0, "carbohydrates": 275.0, "fat": 73.3 },
  "goal_status": {
    "calories_reached": false,
    "proteins_reached": false,
    "carbs_reached": false,
    "fat_reached": false,
    "overall_reached": false
  }
}
```

**Erreur (422 Unprocessable Entity) — Date invalide** :

Si le paramètre `date` est présent mais n'est pas au format `YYYY-MM-DD` :

```json
{
  "message": "La date doit être au format AAAA-MM-JJ.",
  "errors": {
    "date": ["La date doit être au format AAAA-MM-JJ."]
  }
}
```

**Erreur (401 Unauthorized)** :

Token absent ou invalide : réponse standard Sanctum (voir [API Auth](API_AUTH.md)).

---

### 2. Vue mensuelle (calendrier — statut par jour)

Retourne, pour chaque jour du mois demandé, une clé **`monthly_goal_status`** dont les valeurs permettent d'afficher un calendrier : vert (objectif atteint), rouge (non atteint), pas de couleur (aucune donnée ce jour-là).

**Endpoint** : `GET /api/journal/month`

**Headers** :
```
Authorization: Bearer {token}
Accept: application/json
```

**Paramètres de requête** :
| Paramètre | Type   | Requis | Description |
|-----------|--------|--------|-------------|
| `year`    | number | Non    | Année (ex. 2026). Par défaut : année courante. |
| `month`   | number | Non    | Mois (1–12). Par défaut : mois courant. |

**Exemple — Mois actuel** :
```bash
curl -X GET "http://localhost:8000/api/journal/month" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**Exemple — Mois spécifique (février 2026)** :
```bash
curl -X GET "http://localhost:8000/api/journal/month?year=2026&month=2" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "year": 2026,
  "month": 2,
  "monthly_goal_status": {
    "2026-02-01": "not_reached",
    "2026-02-02": "reached",
    "2026-02-03": "reached",
    "2026-02-04": "reached",
    "2026-02-05": "reached",
    "2026-02-06": "not_reached",
    "2026-02-07": "reached",
    "2026-02-08": "not_reached",
    "2026-02-09": "reached",
    "2026-02-10": "reached",
    "2026-02-11": "reached",
    "2026-02-12": "reached",
    "2026-02-13": "reached",
    "2026-02-14": "reached",
    "2026-02-15": "reached",
    "2026-02-16": "not_reached",
    "2026-02-17": "not_reached",
    "2026-02-18": "not_reached",
    "2026-02-19": "reached",
    "2026-02-20": "reached",
    "2026-02-21": "reached",
    "2026-02-22": "reached",
    "2026-02-23": "no_data",
    "2026-02-24": "no_data",
    "2026-02-25": "no_data",
    "2026-02-26": "no_data",
    "2026-02-27": "no_data",
    "2026-02-28": "no_data"
  }
}
```

**Valeurs de `monthly_goal_status[date]`** :
| Valeur         | Signification | Affichage type (calendrier) |
|----------------|---------------|------------------------------|
| `reached`      | Objectif du jour atteint (fourchette 80–120 %) | Fond vert / point vert |
| `not_reached`  | Objectif du jour non atteint | Fond rouge / point rouge |
| `no_data`      | Aucun repas enregistré ce jour, ou pas de profil | Pas de couleur / jour neutre |

Le front peut utiliser directement `monthly_goal_status[date]` pour colorer chaque case du mois (ex. pour « Février 2026 »).

---

## Règles « objectif atteint »

Le champ `goal_status` est calculé uniquement si l'utilisateur possède un profil avec des objectifs quotidiens.

Pour chaque indicateur (calories, protéines, glucides, lipides), l'objectif est considéré **atteint** si la valeur consommée se situe entre **80 % et 120 %** de l'objectif du jour :

| Champ                | Description |
|----------------------|-------------|
| `calories_reached`   | `true` si `consumed.total_calories` ∈ [objectif × 0,8 ; objectif × 1,2] |
| `proteins_reached`   | Idem pour les protéines |
| `carbs_reached`      | Idem pour les glucides |
| `fat_reached`        | Idem pour les lipides |
| `overall_reached`    | `true` si les quatre indicateurs ci-dessus sont atteints |

Exemple : pour un objectif de 2200 kcal, la fourchette est 1760–2640 kcal.

---

## Structure des données

### `consumed`

Totaux nutritionnels du jour, agrégés à partir des repas scannés à la date demandée.

| Clé                    | Type   | Description |
|------------------------|--------|-------------|
| `total_calories`       | number | Calories totales (kcal) |
| `total_proteins`       | number | Protéines totales (g) |
| `total_carbohydrates`  | number | Glucides totaux (g) |
| `total_fat`            | number | Lipides totaux (g) |
| `total_meals`          | number | Nombre de repas enregistrés ce jour |

### `meals`

Chaque élément a la même structure que la ressource d'un repas scanné (voir [MEAL_SCAN_API.md](MEAL_SCAN_API.md)). Les repas sont triés par `scanned_at` (ordre chronologique).

### `goals` (si profil existant)

Objectifs quotidiens issus du profil : `calories`, `proteins`, `carbohydrates`, `fat`.

### `goal_status` (si profil existant)

Booléens par indicateur + `overall_reached` comme indiqué ci-dessus.

### `monthly_goal_status` (endpoint GET /api/journal/month)

Objet dont les clés sont les dates du mois au format `Y-m-d` et les valeurs : `"reached"`, `"not_reached"` ou `"no_data"`. Permet d’afficher le calendrier du mois (vert / rouge / neutre) sans appeler le journal jour par jour.
