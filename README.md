# Based on Creativity
<p align="center">
  <img src="./src/assets/boc_logo.png" alt="Based on Creativity Logo" width="120" />
</p>
<p align="center">
  <em>A legacy digital media company</em><br/>
  <strong>Built in the quiet. Born in the light.</strong>
</p>

<p align="center">

![Status](https://img.shields.io/badge/status-active-111111?style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-111111?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-111111?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-111111?style=flat&logo=vite&logoColor=FFD62E)
![Sanity](https://img.shields.io/badge/Sanity-111111?style=flat&logo=sanity&logoColor=F03E2F)

</p>

---

## Overview

Based on Creativity (BOC) is a modern, content-driven platform focused on expressive digital experiences.  
It blends creative direction with scalable technology to deliver clean, immersive products.

---

## Code Bundle

This is a code bundle for Based on Creativity.  
Original design source:  
https://www.figma.com/design/SiWy7qhnrZrugoS6VzJMib/Based-on-Creativity

---

## Running the Project

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

Run Sanity Studio:

```bash
pnpm sanity dev
```

---

## Tech Stack

- TypeScript (Primary language)  
- React  
- Vite  
- Sanity (Headless CMS)  
- CSS  

---

## Troubleshooting

### Missing Dependencies

If you see:

```
styled-components is not installed
```

Run:

```bash
pnpm add styled-components
```

---

### React / Sanity Conflict

If you see:

```
react/compiler-runtime not exported
```

Fix by reinstalling:

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
- Usually from indirect dependencies  
- Safe to ignore unless critical  

---

### General Reset

```bash
rm -rf node_modules package-lock.json pnpm-lock.yaml
npm install
```

---

## Structure

```
src/            # Frontend
public/         # Static assets
sanity/         # CMS studio
```

---

## Philosophy

> Built in the quiet. Born in the light.

---

## Closing

A foundation for creativity.  
A system for expression.  
A legacy in motion.
