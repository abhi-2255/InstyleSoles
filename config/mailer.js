const nodemailer = require('nodemailer')
const Email = process.env.EMAIL
const Password = process.env.PASSWORD

const transporter = nodemailer.createTransport({
    // host:"smtp-mail.outlook.com",
    service:"gmail",
    auth:{
        user:Email,
        pass:Password
    }
})

async function sendmail(email,otp){
try{
    let message = {
        from:Email,
        to:email,
        subject:"InstyleSoles OTP Verification.",
        text:`Your One Time Password is ${otp}`
    }

    const mailed = await transporter.sendMail(message)
    if(mailed != null)
    {   console.log("mail sent successfully")
        return true
    }
    else{
        console.log(mailed)
        return false
    }
}
catch(err)
{
    console.log(err.message)
}
}

module.exports = {sendmail}