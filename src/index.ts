import { AppDataSource } from "./data-source";
import { Users } from "./entity/Users";
import * as user from '@davse/users_manager';
import "reflect-metadata";
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookies = require("cookie-parser");

var corsOptions = {
    origin: ['http://192.168.0.15:3000','http://localhost:3000'],
    credentials: true,
    methods: ["OPTIONS","HEAD","CONNECT","GET","POST","PUT","DELETE","PATCH"],
    optionsSuccessStatus: 200 
  }
  
  const app = express()
  
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookies());
  
  var jsonParser = bodyParser.json()
  
  var port = process.env.PORT || 8080;

  var repository = AppDataSource.getRepository(Users);
  var newuser = new Users();
  
  app.post('/api/v1/singin', jsonParser, (req,res) => user.singIn(req,res,repository));
  app.post('/api/v1/singup', jsonParser, (req,res) => user.singUp(req,res,repository,newuser));
  app.put('/api/v1/user', jsonParser, (req,res) => user.updateUser(req,res,repository));
  app.delete('/api/v1/user', jsonParser, (req,res) => user.logOut(req,res));
  app.get('/api/v1/user', jsonParser, (req,res) => user.currentUser(req,res,repository));
  app.get('/api/v1/confirm/:confirmationCode', jsonParser, (req,res) => user.authenticateMail(req,res,repository));
  app.post('/api/v1/forgotPassword', jsonParser, (req,res) => user.forgotPasswordMail(req,res,repository));  
  app.put('/api/v1/password', jsonParser, (req,res) => user.resetPassword(req,res,repository));    
  
  app.listen(port, err => {
      if(err) throw new Error(`Error en el servidor: ${err}`);
      console.log(`Servidor express escuchando en el puerto ${port} - PID ${process.pid}`);
  })

