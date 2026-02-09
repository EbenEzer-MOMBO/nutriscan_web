# API de Profils Nutritionnels - NutriScan

## Vue d'ensemble

Cette API permet de gérer les profils nutritionnels des utilisateurs avec calculs automatiques des besoins caloriques et macronutriments basés sur les caractéristiques physiques, le niveau d'activité et les objectifs.

---

## Endpoints

### 1. Récupérer le profil

**Endpoint** : `GET /api/profile`

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
    "gender": "male",
    "age": 25,
    "weight": 75.5,
    "height": 180,
    "bmi": 23.3,
    "bmi_category": "normal",
    "body_type": "mesomorph",
    "goal": "bulk",
    "activity_level": "moderate",
    "daily_targets": {
      "calories": 2850,
      "proteins": 151.0,
      "carbs": 356.3,
      "fat": 79.2
    },
    "target_weight": 80.0,
    "weight_difference": 4.5,
    "dietary_preferences": ["vegetarian"],
    "created_at": "2026-02-08T21:00:00+01:00",
    "updated_at": "2026-02-08T21:00:00+01:00"
  }
}
```

**Erreur (404 Not Found)** :
```json
{
  "success": false,
  "message": "Aucun profil trouvé. Veuillez créer votre profil."
}
```

---

### 2. Créer un profil

**Endpoint** : `POST /api/profile`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** :
```json
{
  "gender": "male",
  "age": 25,
  "weight": 75.5,
  "height": 180,
  "body_type": "mesomorph",
  "goal": "bulk",
  "activity_level": "moderate",
  "target_weight": 80.0,
  "dietary_preferences": ["vegetarian"]
}
```

**Champs requis** :
- `gender` : `male` ou `female`
- `age` : 13-120 ans
- `weight` : 30-300 kg
- `height` : 100-250 cm
- `body_type` : `ectomorph`, `mesomorph`, `endomorph`
- `goal` : `bulk`, `cut`, `recomp`, `maintain`
- `activity_level` : `sedentary`, `light`, `moderate`, `active`, `very_active`

**Champs optionnels** :
- `target_weight` : Poids cible (kg)
- `dietary_preferences` : Tableau de préférences alimentaires

**Réponse (201 Created)** : Même format que GET

> **Note** : Les objectifs nutritionnels (`daily_targets`) sont **calculés automatiquement** selon les formules de Harris-Benedict.

---

### 3. Mettre à jour le profil

**Endpoint** : `PUT /api/profile`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** : Tous les champs sont optionnels
```json
{
  "weight": 76.0,
  "goal": "cut",
  "activity_level": "active"
}
```

**Réponse (200 OK)** : Profil mis à jour avec objectifs recalculés

> **Note** : Les objectifs sont **automatiquement recalculés** lors de chaque modification.

---

### 4. Supprimer le profil

**Endpoint** : `DELETE /api/profile`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "message": "Profil supprimé avec succès."
}
```

---

### 5. Recalculer les objectifs

**Endpoint** : `POST /api/profile/recalculate`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200 OK)** : Profil avec objectifs recalculés

> **Utilité** : Permet de forcer le recalcul si les formules sont mises à jour.

---

## Formules de Calcul

### 1. Métabolisme de Base (BMR)
**Formule de Harris-Benedict révisée**

```
Homme: BMR = 88.362 + (13.397 × poids) + (4.799 × taille) - (5.677 × âge)
Femme: BMR = 447.593 + (9.247 × poids) + (3.098 × taille) - (4.330 × âge)
```

### 2. Dépense Énergétique Totale (TDEE)

```
TDEE = BMR × facteur_activité
```

**Facteurs d'activité** :
- `sedentary` : 1.2 (peu ou pas d'exercice)
- `light` : 1.375 (exercice léger 1-3 jours/semaine)
- `moderate` : 1.55 (exercice modéré 3-5 jours/semaine)
- `active` : 1.725 (exercice intense 6-7 jours/semaine)
- `very_active` : 1.9 (exercice très intense, travail physique)

### 3. Ajustement selon l'Objectif

```
bulk (prise de masse): TDEE + 400 kcal
cut (sèche): TDEE - 400 kcal
recomp (recomposition): TDEE
maintain (maintien): TDEE
```

**Ajustement selon morphologie** :
- **Ectomorphe** : +10% pour bulk, -10% pour cut
- **Mésomorphe** : Standard
- **Endomorphe** : -10% pour bulk, +10% pour cut

### 4. Macronutriments

#### Protéines
```
bulk: 2.0g/kg
cut: 2.2g/kg
recomp: 2.0g/kg
maintain: 1.8g/kg
```

#### Lipides
```
bulk: 25% des calories
cut: 20% des calories
recomp: 25% des calories
maintain: 25% des calories
```

#### Glucides
```
Reste des calories après protéines et lipides
```

---

## Types de Morphologie

### Ectomorphe
- Métabolisme rapide
- Difficulté à prendre du poids
- Ajustement : +10% calories pour bulk

### Mésomorphe
- Métabolisme équilibré
- Gains musculaires faciles
- Ajustement : Standard

### Endomorphe
- Métabolisme lent
- Tendance à stocker les graisses
- Ajustement : -10% calories pour bulk, +10% pour cut

---

## Objectifs

### Bulk (Prise de masse)
- Surplus calorique de 400 kcal
- Protéines élevées (2.0g/kg)
- Lipides modérés (25%)

### Cut (Sèche)
- Déficit calorique de 400 kcal
- Protéines très élevées (2.2g/kg)
- Lipides réduits (20%)

### Recomp (Recomposition)
- Maintenance calorique
- Protéines élevées (2.0g/kg)
- Lipides modérés (25%)

### Maintain (Maintien)
- Maintenance calorique
- Protéines modérées (1.8g/kg)
- Lipides modérés (25%)

---

## Catégories d'IMC

| IMC | Catégorie |
|-----|-----------|
| < 18.5 | `underweight` |
| 18.5 - 24.9 | `normal` |
| 25 - 29.9 | `overweight` |
| ≥ 30 | `obese` |

---

## Exemples d'utilisation

### Créer un profil pour prise de masse
```bash
curl -X POST http://localhost:8000/api/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "male",
    "age": 25,
    "weight": 75,
    "height": 180,
    "body_type": "mesomorph",
    "goal": "bulk",
    "activity_level": "active",
    "target_weight": 82
  }'
```

### Mettre à jour le poids
```bash
curl -X PUT http://localhost:8000/api/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"weight": 76.5}'
```

### Récupérer le profil
```bash
curl -X GET http://localhost:8000/api/profile \
  -H "Authorization: Bearer {token}"
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Ressource créée |
| 401 | Non authentifié |
| 404 | Profil non trouvé |
| 422 | Validation échouée |
| 500 | Erreur serveur |

---

## Prochaines étapes

1. Tester la création de profil
2. Vérifier les calculs nutritionnels
3. Intégrer avec le scan de repas pour comparer consommation vs objectifs
