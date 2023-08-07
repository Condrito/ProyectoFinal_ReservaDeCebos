const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');

const enviarCorreo = async (email, asunto, mensaje) => {
  try {
    const emailAdmin = process.env.EMAIL;
    const passwordAdmin = process.env.PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailAdmin,
        pass: passwordAdmin,
      },
    });

    const info = await transporter.sendMail({
      from: emailAdmin, // Dirección de correo electrónico del remitente
      to: email, // Dirección de correo electrónico del destinatario
      subject: asunto, // Asunto del correo electrónico
      text: mensaje, // Cuerpo del correo electrónico en formato de texto
    });

    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = enviarCorreo;
