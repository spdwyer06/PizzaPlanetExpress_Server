---
# Pizza Planet Express
---

This is my Web Development Red Badge project for Eleven Fifty Academy.

The application was designed to replicate a pizza restaurant point of sales system, but can have the menu items easily swapped out to represent any point of sales system needed.
There are currently a total of 5 database tables being utilized, with multiple database relationships.

## To Use The Application
---
* Make sure to also have the server and client repositories cloned
    * Client: [Link] (https://github.com/spdwyer06/PizzaPlanetExpress_Client)
    * Server: [Link] (https://github.com/spdwyer06/PizzaPlanetExpress_Server)
* Start the server by running the command 'nodemon' in the terminal
* Start the client by running the command 'npm start' in the terminal
* To access the application you must create an account
  * The first user created in the database will be given admin privileges
* If there are no menu items created yet then start there
* When creating an order the first step is to select a customer
   * If the customer isn't shown then you can create a new entry in the database to save the customer info for future orders
* Once a customer has been selected then you can choose the menu items you would like to add to the order
* The order can have the selected menu items edited easily

## User Roles
---
### Admin
* Special privileges include:
   * Create/Edit/Delete menu items
   * Edit/Delete user accounts
   * Delete customer records 
   * Delete orders
   
### Manager
* Special privileges include:
   * Edit/Delete user accounts
   * Delete customer records
   * Delete orders

### Employee
* Basic privileges include:
   * Create/Update customer records
   * Create/Edit orders


## Technologies Used
---
* JavaScript
* Typescript
* React
* React Class Components

## Key Node Pacakages Used
---
* express
* moment
* react-router
* reactstrap
* jsonwebtoken
* bcrypt
* nodemon
* sequelize

Contact Me
---
Email spdwyer06@gmail.com with any feedback, questions, or suggestions for improvement.
