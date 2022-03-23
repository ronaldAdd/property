const { Expo } = require('expo-server-sdk');

class pushNotification{

    somePushTokens=[]
    constructor(somePushTokens){
        this.somePushTokens.push(somePushTokens)
    }

    send(data){
        let expo = new Expo({ accessToken: 'CSHoP6aFw0NyI1OxbZNbdIw6cnF8NZE5iNchqg1t' });
        let messages = [];
        for (let pushToken of this.somePushTokens) {
            if (!Expo.isExpoPushToken(pushToken)) {
              console.error(`Push token ${pushToken} is not a valid Expo push token`);
              return ({"message" : `Push token ${pushToken} is not a valid Expo push token`})
              continue;
            }
            messages.push({
                to: pushToken,
                sound: "default",
                title:data[0].title,
                body: data[0].body,
                data: data[0].data,
            })
          }
          let chunks = expo.chunkPushNotifications(messages);
          let tickets = [];
          (async () => {
              // Send the chunks to the Expo push notification service. There are
              // different strategies you could use. A simple one is to send one chunk at a
              // time, which nicely spreads the load out over time:
              for (let chunk of chunks) {
                try {
                  let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                //   console.log(expo)
                //   console.log(ticketChunk);
                  tickets.push(...ticketChunk);
                  if(ticketChunk[0].status ==='error') return ({"message" : 'error'}) 
                  // NOTE: If a ticket contains an error code in ticket.details.error, you
                  // must handle it appropriately. The error codes are listed in the Expo
                  // documentation:
                  // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                } catch (error) {
                    return ({"message" : error.message})
                  console.error(error);
                }

              }
            })();  
            return ({"message" : 'success'})
        
    }
  




}

module.exports = pushNotification;
