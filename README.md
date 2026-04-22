# Based on Creativity

![Status](https://img.shields.io/badge/status-active-black)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Sanity](https://img.shields.io/badge/Sanity-CMS-red)
![License](https://img.shields.io/badge/license-private-lightgrey)

A legacy digital media company building timeless creative experiences through technology, storytelling, and design.

---

## ✨ Overview

Based on Creativity (BOC) is a modern, content-driven platform focused on expressive digital experiences.  
It blends creative direction with scalable technology to deliver clean, immersive products.

---

## 🎨 Preview

> _Add a screenshot or banner here_

```
/public/preview.png
```

---

## 📦 Code Bundle

This is a code bundle for Based on Creativity.  
Original design source:  
https://www.figma.com/design/SiWy7qhnrZrugoS6VzJMib/Based-on-Creativity

---

## 🚀 Running the Project

Install dependencies:

```bash
npm i
```

Start the development server:

```bash
npm run dev
```

Run Sanity Studio:

```bash
pnpm sanity dev
```

---

## 🧰 Tech Stack

- React  
- Vite  
- Sanity (Headless CMS)

---

## 🛠 Troubleshooting

### Missing Dependencies

```
styled-components is not installed
```

Fix:

```bash
pnpm add styled-components
```

---

### React / Sanity Conflict

```
react/compiler-runtime not exported
```

Fix:

```bash
rm -rf node_modules package-lock.json pnpm-lock.yaml
npm install
```

---

### Dependency Errors (ERESOLVE)

Avoid:

```bash
npm audit fix --force
```

Instead:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Vulnerabilities

- Moderate warnings are common  
- Safe to ignore unless critical  

---

## 📁 Structure

```
src/            # Frontend
public/         # Static assets
sanity/         # CMS studio
```

---

## 🧠 Philosophy

> Built in the quiet. Born in the light.

---

## 🕊️ Closing

A foundation for creativity.  
A system for expression.  
A legacy in motion.
