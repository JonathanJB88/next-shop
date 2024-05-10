# Description

## Run in dev mode

1. Clone the repository
2. Create a copy of the `.env.template` file and rename it to `.env` and change the enviroment variables.
3. Install dependencies `npm install`
4. Up the database `docker compose up -d`
5. Run prisma migrations `npx prisma migrate dev`
6. Run the database seed `npm run seed`
7. Clean browser localstorage
8. Run the project `npm run dev`

## Run in prod
