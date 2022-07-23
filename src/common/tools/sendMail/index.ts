import * as nodemailer from 'nodemailer';

const encodeEmail = (email: string) => {
  const aa = email.split('@');
  const len = aa[0].length - 1;
  let enc = aa[0][0];
  for (let i = 1; i < 3; i++) {
    enc += '*';
  }
  enc += aa[0][len];
  aa[0] = enc;
  return aa.join('@');
};

const sendMail = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'phieubengao@gmail.com',
        pass: 'geqdeynowturpgut',
      },
    });

    const mailOptions = {
      from: 'phieubengao@gmail.com',
      to: email,
      subject: 'Reset password',
      text: `Your OTP: ${otp}, OTP code will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return `OTP has been send to ${encodeEmail(email)}`;
  } catch (e) {
  }
};

export default sendMail;
