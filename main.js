require('dotenv').config()
const argv = require('yargs').argv
const Twilio = require('twilio')
const GoogleHome = require('google-home-notify')
const { timeFrame, coolDown, members, exercises } = require(argv.config)

Array.prototype.random = function(){
    return this[Math.floor(Math.random() * this.length)]
}

Date.prototype.addMinutes = function(m) {
    this.setMinutes(this.getMinutes() + m)
    return this
}

const sleepUntil = (date) => {
    return new Promise(resolve => setTimeout(resolve, Math.abs(date - new Date())))
}

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

(async function init() {
    while (true) {
        let participant = members.random()
        let exercise = exercises.random()
        let reps = random(exercise.min, exercise.max)
        let coolDownTime = random(coolDown.min, coolDown.max)
        let nextExerciseDate = new Date()

        let message = `${participant.name} - do ${reps} ${exercise.unit} of ${exercise.name} now!`
        console.log(message)

        if (argv.googleHome) {
            const googleHomeClient = new GoogleHome(process.env.GOOGLE_HOME_IP, "en-US", 1)
            googleHomeClient.notify(message)
        }

        if (argv.whatsApp) {
            const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

            let messages = []
            for (const member of members) {
                let options = {
                    from: `whatsapp:${process.env.TWILIO_SENDER}`,
                    body: message,
                    to: `whatsapp:${member.phone}`
                }

                messages.push(
                    twilioClient.messages.create(options).then((msg) => console.log(msg))
                )
            }

            await Promise.all(messages).catch((e) => console.error(e))
        }

        do {
            nextExerciseDate.addMinutes(coolDownTime)
        } while (!(nextExerciseDate.getHours() >= timeFrame.start && nextExerciseDate.getHours() <= timeFrame.end))

        console.log(`Next exercise on ${nextExerciseDate.toLocaleString()}`)
        await sleepUntil( nextExerciseDate)
    }
})()