# 🚀 Deployment Guide - AlternHub

Guide complet pour déployer AlternHub sur Netlify.

## Table des matières

- [Prérequis](#prérequis)
- [Déploiement sur Netlify](#déploiement-sur-netlify)
- [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
- [Base de données en production](#base-de-données-en-production)
- [Troubleshooting](#troubleshooting)

---

## Prérequis

- ✅ Repo GitHub poussé : `Cyber-Avenir/AlterNHub`
- ✅ Compte Netlify actif
- ✅ Accès à l'organisation Cyber Avenir sur GitHub

---

## Déploiement sur Netlify

### Option 1 : Deploy depuis GitHub (Recommandé)

1. **Accède à Netlify** : https://app.netlify.com

2. **Clique** : "Add new site" → "Import an existing project"

3. **Sélectionne** GitHub comme provider

4. **Autorise** Netlify à accéder à ton compte GitHub

5. **Cherche** le repo : `Cyber-Avenir/AlterNHub`

6. **Configure le build** :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next/standalone`
   - **Functions directory** : `netlify/functions` (optionnel)

7. **Clique** "Deploy site"

### Option 2 : Deploy depuis la CLI

```bash
# 1. Installe Netlify CLI
npm install -g netlify-cli

# 2. Authentifie-toi
netlify login

# 3. Déploie
cd D:/AlterNHub
netlify deploy --prod
```

---

## Configuration des variables d'environnement

### Sur Netlify Dashboard

1. Va à **Site Settings** → **Build & deploy** → **Environment**

2. Clique **Edit variables**

3. Ajoute les variables suivantes (copie du `.env.example`) :

```
DATABASE_URL = "postgresql://user:pass@host/db"
NEXTAUTH_SECRET = "your-generated-secret"
NEXTAUTH_URL = "https://your-domain.netlify.app"
NODE_ENV = "production"
NEXT_PUBLIC_APP_URL = "https://your-domain.netlify.app"
```

### Variables importantes

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `DATABASE_URL` | PostgreSQL en production | ✅ Oui |
| `NEXTAUTH_SECRET` | Secret généré (`openssl rand -base64 32`) | ✅ Oui |
| `NEXTAUTH_URL` | URL du site en production | ✅ Oui |
| `NODE_ENV` | `production` | ✅ Oui |
| `NEXT_PUBLIC_APP_URL` | URL publique du site | ✅ Oui |

---

## Base de données en production

### ⚠️ Important : SQLite ne convient PAS pour la production

AlternHub utilise **SQLite en développement**, mais pour la production, tu **dois** utiliser **PostgreSQL**.

### Migration vers PostgreSQL

#### 1. **Crée une DB PostgreSQL**

Options :
- [Heroku Postgres](https://www.heroku.com/postgres) (gratuit)
- [Railway](https://railway.app) (facile)
- [Render](https://render.com) (recommandé)
- [AWS RDS](https://aws.amazon.com/rds/)

#### 2. **Mets à jour DATABASE_URL**

```
DATABASE_URL="postgresql://user:password@host:5432/alternhub"
```

#### 3. **Migre le schéma Prisma**

```bash
# En local d'abord (avec DB de staging)
npx prisma db push

# Ou crée les migrations
npx prisma migrate deploy
```

#### 4. **Seed les données en prod (optionnel)**

```bash
# Sur Netlify, après déploiement
npx prisma db seed
```

---

## Domaine personnalisé

### Ajoute un domaine sur Netlify

1. **Site settings** → **Domain management**

2. **Add domain**

3. Choisis :
   - Domaine Netlify `.netlify.app` (gratuit)
   - Ou un domaine personnalisé (requiert DNS)

4. Mets à jour `NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL` en conséquence

---

## Optimisation Netlify

### Build Optimization

La config `netlify.toml` inclut déjà :

- ✅ Cache headers pour assets statiques
- ✅ Security headers
- ✅ Redirects pour SPA routing
- ✅ Correct Node.js version

### Functions (API Routes)

Les API Routes Next.js sont automatiquement converties en **Netlify Functions**. Aucune config manuelle requise.

---

## Monitoring & Logs

### Voir les logs de build/deploy

1. Va à **Deploys** dans Netlify Dashboard
2. Clique le déploiement concerné
3. Scroll down pour voir les **Build logs**

### Erreurs communes

**Erreur : "DATABASE_URL not found"**
```
→ Ajoute DATABASE_URL à Netlify Environment Variables
```

**Erreur : "NEXTAUTH_SECRET is invalid"**
```
→ Génère une nouvelle clé : openssl rand -base64 32
```

**Build timeout (> 15 min)**
```
→ Optimise le build ou contacte Netlify pour augmenter le timeout
```

---

## Redeploiement

### Redéploie automatiquement sur git push

- Netlify surveille la branche `main` par défaut
- Chaque push trigger un redéploiement automatique
- Change la branche dans **Site settings** si nécessaire

### Redéploie manuellement

```bash
# Via CLI
netlify deploy --prod

# Via Dashboard : "Deploys" → "Trigger deploy" → "Deploy site"
```

---

## Backup & Rollback

### Rollback à un déploiement précédent

1. Va à **Deploys** dans Netlify
2. Clique le déploiement antérieur
3. Clique les **3 points** → **Publish deploy**

---

## Sécurité

### Checklist avant production

- [ ] DATABASE_URL configurée et testé
- [ ] NEXTAUTH_SECRET défini (complexe, 32+ chars)
- [ ] NEXTAUTH_URL correct
- [ ] Domaine HTTPS activé (automatique sur Netlify)
- [ ] Logs d'erreur vérifiés
- [ ] Test complet des fonctionnalités auth
- [ ] Variables sensibles dans Netlify (pas hardcodées)
- [ ] CORS configuré si nécessaire

---

## Performance

### Mesure la performance

- **Netlify Analytics** : Dashboard → Analytics
- **Google PageSpeed Insights** : https://pagespeed.web.dev
- **WebPageTest** : https://www.webpagetest.org

### Optimisations courantes

1. **Compresse les images** → Utilise Next.js Image component
2. **Code splitting** → Next.js le fait automatiquement
3. **Cache assets** → Déjà configuré dans `netlify.toml`
4. **CDN** → Netlify l'inclut gratuitement

---

## Support & Ressources

- **Netlify Docs** : https://docs.netlify.com
- **Next.js on Netlify** : https://docs.netlify.com/integrations/frameworks/next-js/
- **Prisma Deployment** : https://www.prisma.io/docs/guides/deployment
- **GitHub Issues** : https://github.com/Cyber-Avenir/AlterNHub/issues

---

**Questions ou problèmes ?** Ouvre une issue GitHub ! 🚀
