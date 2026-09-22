# Pinheiro Pets

![Pinheiro Pets Logo](./public/branding/pinheiro-pets-logo.png)

Pinheiro Pets is an educational university extension project built to support the animal protection community in the Federal District of Brazil.

The platform connects local NGOs, independent protectors, volunteers, adopters, and donors through a moderated web system focused on:

- lost pets
- responsible adoption
- NGO visibility
- direct Pix donations

---

## About the project

This project was created as an academic extension initiative aligned with:

- **ODS 10 — Reduced Inequalities**
- **Proposal 03 — Digital inclusion and access to technology for the community**

Its purpose is to offer a simple and accessible digital solution for a community that often depends on fragmented social media posts to publicize urgent animal-related cases.

---

## Main features

### Authentication

- user registration and login
- email confirmation with Supabase Auth
- account page with personal publication management
- role-based access for administrators

### Lost pets

- create lost pet submissions
- upload pet images
- public listing of approved posts
- detail page
- author edit and delete actions
- moderation status reset after approved content is edited
- pending submission limit to reduce spam

### Adoption

- create adoption posts
- image upload
- public listing of approved adoption posts
- detail page
- author edit and delete actions
- moderation flow for approval and rejection
- pending submission limit

### NGOs and donations

- NGO registration requests
- NGO logo upload
- public NGO listing
- NGO detail page
- Pix donation information
- owner edit and delete actions
- moderation flow for approval and rejection
- pending submission limit

### Admin dashboard

- moderate lost pet posts
- moderate adoption posts
- moderate NGO submissions
- approve or reject pending content
- delete published or rejected content
- centralized moderation view

---

## Tech stack

- **Next.js 16**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
  - Authentication
  - PostgreSQL Database
  - Row Level Security
  - Storage

---

## Project structure

```bash
src/
  app/
  components/
  lib/
  types/

supabase/
  migrations/
```

---

## Environment variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

---

## Running locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

---

## Database and Supabase

This project uses SQL migrations stored in:

```bash
supabase/migrations/
```

These migrations cover:

- schema creation
- moderation triggers
- RLS policies
- storage buckets and policies
- protection against excessive pending submissions

---

## Educational note

Pinheiro Pets is an **educational project** created for academic purposes.

Although it simulates a real platform structure with authentication, moderation, storage, and deployment flow, it was designed as a learning experience and proof of concept for university extension work.

---

## Author

Developed by **Victor Macene** as part of a university extension project.