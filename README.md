# tmessage API

This is a RESTful API handling authentication logic for [tmessage](https://github.com/Haider8/tmessage) - a lightweight and low bandwidth chatting tool.

## Installation and Hosting

First, to host this API locally, you would need...
* Node.js and NPM (Noed Package Manager) installed
* A text editor
* A command-line terminal

Second, you would need to host a MongoDB database. You can either do it locally or on a service such as [mongoDB Atlas](https://www.mongodb.com/cloud/atlas). When the database is up and running, you need a connection string to set up connection between the API and the database (follow [this instruction](https://www.youtube.com/watch?v=Ej05tq1220A) if you use [mongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

Step-by-step to set up the API:
1. Open the terminal where you want to store the project
1. Clone the project:
    ```shell
    git clone https://github.com/Haider8/tmessage-api.git
    ```
1. Navigate into the project:
    ```shell
    cd tmessage-api
    ```
1. Install all dependencies/packages of the project:
    ```shell
    npm i
    ```
1. Create a file named `.env` in the current directory:
    ```shell
    touch .env
    ```
1. Open the `.env` file with a text editor and enter the following content:
    ```
    MONGODB_CONNECTION_STRING=[Your MongoDB connection string]
    ```
1. Subtitute `[Your MongoDB connection string]` with your MongoDB connection string you got earlier.
1. Save and close the file.
1. Host the API:
    ```shell
    node server.js
    ```
1. Use an Http Client (e.g.: Postman) to test the API.

## API References

### POST: /api/user/register

Make a reuqest to this route to register a User Account, expected body data shape:
* userName: A string
* password: A string
* passwordConfirm: A string matches password

The reponse of returned data includes 2 fields:
* success: `true` if the registration process is successfull, `false` otherwise
* message: A message

### POST: /api/user/login

Make a reuqest to this route to login, expected body data shape:
* userName: A string
* password: A string

The reponse of returned data includes 2 fields:
* success: `true` if the login process is successfull, `false` otherwise
* message: A message

### GET: /api/user/checkExist/:userName

Make a request to this route to check if a userName is occupied or not.
The reponse of returned data includes 3 fields:
* success: `true` if the checking process is successfull, `false` otherwise
* exist: `true` if the userName is occupied, `false` if the userName is not taken, `undefined` if `success` is `false`
* message: A message
