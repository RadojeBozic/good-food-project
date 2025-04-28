# Good-Food Project

Good-Food is a fullstack application built with Laravel API backend and React frontend.  
It is designed as an online marketplace for trading healthy food between suppliers, delivery services, and customers.

## Technologies Used
- Backend: Laravel 12 (API)
- Frontend: React + Vite
- Database: MySQL
- Authentication: Laravel Sanctum
- CORS: Fully configured

## Key Features
- Registration and login system (Laravel Sanctum API Tokens)
- Protected Dashboard
- Different user roles: SuperAdmin, Admin, Agent, Customer
- Modular, scalable architecture
- Ready for production deployment

---

# Projekat Good-Food

Good-Food je fullstack aplikacija razvijena koristeći Laravel API backend i React frontend.  
Osmislili smo ga kao online platformu za trgovinu zdravom hranom između dobavljača, dostavljača i kupaca.

## Tehnologije korišćene
- Backend: Laravel 12 (API)
- Frontend: React + Vite
- Baza podataka: MySQL
- Autentifikacija: Laravel Sanctum
- Puna CORS podrška

## Ključne funkcionalnosti
- Sistem registracije i prijave (Laravel Sanctum API tokeni)
- Zaštićeni Dashboard
- Razine korisnika: SuperAdmin, Admin, Agent, Kupac
- Modularna i skalabilna arhitektura
- Spreman za produkciono okruženje

---

## Installation Instructions

### Backend (Laravel)
```bash
cd good-food-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

### Frontend (React)
cd frontend
npm install
npm run dev

## Screenshots

## 📜 License
All rights reserved © 2025 Good Food

