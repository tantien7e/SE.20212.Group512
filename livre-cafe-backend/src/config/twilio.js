const accountSid = 'ACd16f660b1297443fa819d80d1a8a2e97';
const authToken = '5cea0d38832b9371c6b683e38629e860';
const client = require('twilio')(accountSid, authToken);

module.exports.sendVerificationCode = (phoneNumber, verificationCode) => {
    client.messages
        .create({
            from: "+19705489497",
            to: `+${phoneNumber}`,
            
        })
        .then(message => console.log(message))
        .catch(err =>  console.log(err));
}
