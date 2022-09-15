# sequelize-demo
A sequelize demo for brown bag

# Migrations
- Scripts that help you create and update your database schema over time.
1. Create a regions table
   - `npx sequelize-cli migration:generate --name create-regions-table`

2. Create a countries table with an association to the regions table.
   -  `npx sequelize-cli migration:generate --name create-countries-table`

3. Add a display_name column to regions
   - `npx sequelize-cli migration:generate --name add-display-name-to-regions`
# Seeders
- Scripts that help you populate your database tables.
- `npx sequelize-cli db:seed:all`

# Sequelize Auto
- A library that will create your models based off of your existing database schema
`npm run update-models`
# Controllers
- Use sequelize logic to write queries rather than direct SQL

# Endpoints
- See the data from the controller.