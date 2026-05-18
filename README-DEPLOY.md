# OASIS Portfolio — Internetga joylash

## 1️⃣ GitHub ga yuklash

1. **Git ni o'rnating** → https://git-scm.com/download/win
2. **GitHub account oching** → https://github.com
3. **GitHub'da yangi repository yarating** (public, README qo'shmang)
4. Kompyuterda quyidagilarni bajaring:

```bash
cd C:\Users\ABDURASULOV.B.N\Desktop\myprojects\oasis-portfolio

git init
git branch -M main
git add .
git commit -m "Initial commit: OASIS Portfolio"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2️⃣ Supabase (ma'lumotlar bazasi)

1. **Supabase account oching** → https://supabase.com (GitHub bilan kirish)
2. **New project** yarating → Organizatsiya: personal, Name: `oasis-portfolio`, Database password: o'zingizni parolingiz, Region: nearest
3. **Kuting** (2-3 daqiqa project yaratilishi)
4. **SQL Editor** ga kiring → https://app.supabase.com/project/_/sql/new
5. `supabase-schema.sql` faylidagi hamma kodni copy-paste qilib **Run** bosing
6. **Project Settings → API** ga kiring:
   - `Project URL` ni nusxalang (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key ni nusxalang (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 3️⃣ Vercel (frontendni joylash)

1. **Vercel account oching** → https://vercel.com (GitHub bilan kirish)
2. **Add New → Project** → GitHub repository ni tanlang
3. **Environment Variables** ga qo'shing:
   - `NEXT_PUBLIC_SUPABASE_URL` = supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
4. **Deploy** tugmasini bosing
5. Tayyor! `https://oasis-portfolio.vercel.app` da saytingiz

## 4️⃣ Keyinchalik (pullik)

- Domen sotib oling (masalan `oasis.uz`)
- Vercel → Project Settings → Domains ga qo'shing
- DNS sozlamalarini Vercel ko'rsatganicha o'rnating

## Muhim

- Har safar GitHub'ga push qilsangiz, Vercel avtomatik deploy qiladi
- 3D BMW M4 modeli 21.68 MB — telefonlarda sekin yuklanishi mumkin
