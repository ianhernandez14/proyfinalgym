const nodemailer = require('nodemailer');

exports.enviarCorreo = async (req, res) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    return res.status(400).json({ message: 'Faltan datos requeridos.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'al347589@edu.uaa.mx', // cambia esto
        pass: 'Josimar3108' // cambia esto
      }
    });

    const mailOptions = {
      from: 'al347589@edu.uaa.mx',
      to: email,
      subject: 'Confirmación de Inscripción',
      text: `Hola ${fullName}, gracias por registrarte en nuestra actividad del gimnasio.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};