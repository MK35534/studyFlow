# 🎨 Icônes PWA StudyFlow

## 📋 Icônes Requises

Pour que la PWA fonctionne correctement, tu dois générer ces icônes à partir de ton logo :

### Icônes Standards
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Icônes Maskables (Android)
- `icon-maskable-192x192.png`
- `icon-maskable-512x512.png`

### Icônes Apple (iOS)
- `apple-touch-icon.png` (180x180)

---

## 🛠️ Comment Générer les Icônes ?

### Option 1 : Outil en ligne (GRATUIT)
👉 **https://www.pwabuilder.com/imageGenerator**

1. Upload ton logo (idéalement 512x512 ou plus)
2. Clique sur "Generate"
3. Télécharge le ZIP
4. Copie tous les fichiers dans `/public/icons/`

### Option 2 : Photoshop/Figma
- Créer un carré avec ton logo centré
- Exporter aux tailles listées ci-dessus
- Format PNG avec transparence

### Option 3 : CLI (si tu as ImageMagick)
```bash
# À partir d'une image source 1024x1024
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

---

## 📱 Icônes Maskables

Les icônes maskables sont utilisées par Android pour s'adapter aux différentes formes (rond, carré, squircle).

**Important** : Le logo doit être dans la **safe zone** (80% du centre)

```
┌─────────────────┐
│                 │
│   ┌─────────┐   │ ← 10% padding
│   │         │   │
│   │  LOGO   │   │ ← Safe zone
│   │         │   │
│   └─────────┘   │
│                 │
└─────────────────┘
```

---

## 🎨 Recommandations Design

### Couleurs
- Fond : Blanc ou Bleu StudyFlow (#3b82f6)
- Logo : Contraste élevé
- Pas de transparence sur maskable

### Style
- Simple et reconnaissable
- Lisible en petit (72x72)
- Cohérent avec ta marque

---

## ✅ Checklist

- [ ] Générer toutes les icônes (10 fichiers)
- [ ] Vérifier la visibilité à 72x72
- [ ] Tester sur fond clair et foncé
- [ ] Ajouter les fichiers dans `/public/icons/`
- [ ] Redémarrer le serveur Nuxt

---

## 🚀 Pour l'instant

J'ai créé une icône placeholder bleue avec "SF" (StudyFlow).
Tu peux la remplacer par ton vrai logo quand tu l'auras !

**Priorité** : L'app fonctionnera avec le placeholder, tu peux changer les icônes plus tard.
