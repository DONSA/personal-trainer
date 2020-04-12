# personal-trainer 💪
A fun way to encourage a group of people to workout!

Find the local IP of your Google Home.  
Create Twilio account and setup an [WhatsApp sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox).
```
# Add the env variables and your specific configuration
mv .env.example .env
mv example.json config.json

# Install dependencies
npm install

# Run the command with the pretended notification channels
node main.js --config="./config.json" --googleHome --whatsApp
```
