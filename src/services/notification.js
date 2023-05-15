import axios from 'axios';
const serverKey = process.env.API_KEY_GOOGLE_FCM;
import connection from '../configurations/database'
import { promisify } from 'util';

const query = promisify(connection.query).bind(connection);

const sendNotificationForFCM = async (listTokens,notification,dataNotification) => {
  const response = await axios.post('https://fcm.googleapis.com/fcm/send',
    {
      "registration_ids" : listTokens,
      "notification" : notification,
      "data":dataNotification
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key = ' + serverKey 
      }
    })
  const {status, data} = response
  return { send: status == 200, status, data };
}

export const inserToken = async (username, token) => {
  const user = await findByUserName(username);
  if (user) {
    if (user.toker != token) {
      return await query('UPDATE firebase_notifications SET token = ? WHERE username = ?', [token, username])
    }
    
  } else {
      return await query('INSERT INTO firebase_notifications SET ?', {
      username: username,
      token: token,
    });
  }
}

const findByUserName = async (username) => {
  return (await query(
      'SELECT * FROM firebase_notifications WHERE username = ?',
      [username]
    ))[0];
}


export const sendNotifications = async (listUsers, notification, data) => {
  let listTokens = [];

  for (const username of listUsers) {
    const user = await findByUserName(username);
    if (user) {
      listTokens.push(user.token);
    }
  }

  return await sendNotificationForFCM(listTokens, notification, data);
}

export const findAllUsers = async () => {
  return await query(
      'SELECT * FROM firebase_notifications'
    );
}