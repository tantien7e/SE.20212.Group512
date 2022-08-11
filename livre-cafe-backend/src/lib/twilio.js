const accountSid = 'ACd16f660b1297443fa819d80d1a8a2e97';
const authToken = 'dd77ff2594c17729b16e48ec65367f0f';
const client = require('twilio')(accountSid, authToken);

module.exports.sendVerificationCode = (phoneNumber, verificationCode) => {
    client.messages
        .create({
            from: "+19705489497",
            to: `+${phoneNumber}`,
            body: `Livre Café\nYour verification code is: ${verificationCode}`
        })
        .then(message => console.log(message.body))
        .catch(err => console.log(err));
}
