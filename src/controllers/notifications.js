import express from "express";
import { sendNotifications, inserToken, findAllUsers } from "../services/notification"

let router = express.Router();

router.get('/get-users', async (req, res) => {
  try {

    const users = await findAllUsers();
    res.status(200).json(users);

  } catch (error) {
    console.log(error);
    if (error.code && error.message) {
      res.status(error.code).json(error);
    } else {
      console.log('error inesperado ' + JSON.stringify(error));
      res.status(500).json(error);
    }
  }

});

router.post('/send-notification', async (req, res) => { 
  try {

    let { listUsers, notification, data } = req.body;

    if (!listUsers || listUsers.length < 1) {
      throw { code: 400, message: "Debe mandar el listUsers en el body de la request" }
    }

    if (!notification) {
      throw { code: 400, message: "Debe mandar el notification en el body de la request" }
    }

    if (!data) {
      data = {};
    }
    /*const notification ={
      title: "Nuevo mensaje",
      body: "Tienes un nuevo mensaje de Juan"
    }
    const data = {
      type: "message",
      sender: "Juan",
      message: "Hola, ¿cómo estás?"
    }*/

    const response = await sendNotifications(listUsers, notification, data);
    res.status(200).json(response);
    
  } catch (error) {
    if (error.code && error.message) {
      res.status(error.code).json(error);
    } else {
      console.log('error inesperado ' + JSON.stringify(error));
      res.status(500).json(error);
    }
  }
});


router.post('/add-token', async (req, res) => {
  try {
    const { username, token } = req.body;
    if (!username) {
      throw { code: 400, message: "Debe mandar el username en el body de la request" }
    }
  
    if (!token) {
      throw { code: 400, message: "Debe mandar el token en el body de la request" }
    }
    const user = await inserToken(username, token);
    res.status(200).json(user);

  }catch (error) {
    if (error.code && error.message) {
      res.status(error.code).json(error);
    } else {
      console.log('error inesperado ' + JSON.stringify(error));
      res.status(500).json(error);
    }
  }

});


export default router;