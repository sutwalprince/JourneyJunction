const nodemailer = require("nodemailer");

async function  sendConfirmationMail({ recipient_email ,data, hotel , checkin , checkout , price ,guests ,roomtype}) {
    return new Promise((resolve, reject) => {
    // console.log(hotel.hotelimage)

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });
  
      const mail_configs = {
        from: process.env.MY_EMAIL,
        to: "sutwalp1@gmail.com" ,
        subject: "Journey Junction Hotel reservation ",
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hotel Booking Confirmation</title>
        </head>
        
        <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        
            <!-- Greeting -->
            <h1 style="text-align: center; margin-top: 20px;">Booking Confirmation</h1>
        
            <p>Dear ${data.name},</p>
        
            <p>
                We are excited to inform you that your room booking at [Hotel Name] has been confirmed. Below are the details of
                your reservation:
            </p>
        
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 10px; text-align: left;">Hotel Name:</th>
                    <td style="padding: 10px;">${hotel.name}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; text-align: left;">Check-in Date:</th>
                    <td style="padding: 10px;">${checkin}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 10px; text-align: left;">Check-out Date:</th>
                    <td style="padding: 10px;">${checkout}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; text-align: left;">Room Type:</th>
                    <td style="padding: 10px;">${roomtype}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 10px; text-align: left;">Total Guests:</th>
                    <td style="padding: 10px;">${guests}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; text-align: left;">Total Price:</th>
                    <td style="padding: 10px;">${price}</td>
                </tr>
            </table>
        
            <!-- Additional Information -->
            <p>
                If you have any special requests or need any further assistance, please feel free to contact our customer
                support team at ${hotel.contact} or via email at ${hotel.email}.
            </p>
        
            <!-- Thank You Message -->
            <p>
                Thank you for choosing ${hotel.name}. We look forward to welcoming you and ensuring you have a pleasant stay with
                us.
            </p>
        
            <!-- Signature -->
            <p style="text-align: right;">
                Best Regards,<br>
                The Journey Junction Team
            </p>
        
            <!-- Footer Note -->
            <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
                This is an automated email. Please do not reply directly to this email.
            </p>
        
        </body>
        
        </html>
        `,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          // console.log(error);
          return reject({ message: error });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  }

  module.exports = sendConfirmationMail;