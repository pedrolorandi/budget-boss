# BudgeBoss - Lighthouse Labs final project

In today’s age, keeping track of your finances is more important than ever. With so many different transactions like groceries, side hustles, and monthly subscriptions, understanding how your money flows can become a pain.

That is why we’d like to introduce BudgetBoss, a budgeting app that will keep track of your money for you. With BudgetBoss, you can record your income and expenses in your various accounts and view them all in one place with clean visual graphs.

Organize your monthly budget and see how you’re progressing daily and meeting your budget goals so you can be the boss of your own budget.<br/><br/>

## Authors

- [@binding1](https://github.com/binding1)
- [@Dango3010](https://github.com/Dango3010)
- [@pedrolorandi](https://github.com/pedrolorandi)

## Demo

### Overview

!["Overview"](https://github.com/pedrolorandi/budget-boss/blob/main/planning/overview_screen.gif?raw=true)

### Transactions

!["User Page"](public/images/screenshots/admin_page.gif)

### Budgets

!["Filtering"](public/images/screenshots/filter.gif)

### Reports

!["Card Id"](public/images/screenshots/contact_seller.gif)

## Run Locally

Clone the project

```bash
  git clone https://github.com/Ruheee/CardHeros
```

Go to the project directory

```bash
  cd budget-boss
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
On browser

```bash
localhost:3000
```


## Tech Stack

React, Next.js, SQLite, Prisma, Tailwind

## Dependencies

- @fortawesome/fontawesome-svg-core ^6.4.0
- @fortawesome/free-regular-svg-icons ^6.4.0
- @fortawesome/free-solid-svg-icons ^6.4.0
- @fortawesome/react-fontawesome ^0.2.0
- @prisma/client ^4.12.0
- axios ^1.4.0
- chart.js ^4.3.0
- chartjs-plugin-datalabels ^2.2.0
- eslint 8.37.0
- eslint-config-next 13.2.4
- next 13.2.4
- prisma ^4.12.0
- react 18.2.0
- react-chartjs-2 ^5.2.0
- react-dom 18.2.0
- tailwind ^4.0.0

## Database

Database schema migrations

```bash
npx prisma migrate dev
```

Force reset database, apply migrations, and seed data 

```bash
npx prisma db push --force-reset && npx prisma db push && npx prisma db seed
```

### schema
!["schema"](https://github.com/pedrolorandi/budget-boss/blob/main/planning/db_schema.png?raw=true)
