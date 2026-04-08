import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { Nome, Email, Telefone, Servico, Assunto, Mensagem } = req.body;

  if (!Nome || !Email || !Mensagem) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Configure transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${Nome}" <${process.env.SMTP_SENDER || 'brunoevangelistasi@proton.me'}>`,
    to: process.env.CONTACT_EMAIL || 'engenhariaeimoveis@hotmail.com',
    replyTo: Email,
    subject: `Novo Contato: ${Assunto || 'Sem Assunto'} - ${Servico || 'Sem Serviço'}`,
    text: `
      Nome: ${Nome}
      Email: ${Email}
      Telefone: ${Telefone || 'N/A'}
      Serviço: ${Servico || 'N/A'}
      Assunto: ${Assunto || 'N/A'}
      
      Mensagem:
      ${Mensagem}
    `,
    html: `
      <h3>Novo Contato do Site</h3>
      <p><strong>Nome:</strong> ${Nome}</p>
      <p><strong>Email:</strong> ${Email}</p>
      <p><strong>Telefone:</strong> ${Telefone || 'N/A'}</p>
      <p><strong>Serviço:</strong> ${Servico || 'N/A'}</p>
      <p><strong>Assunto:</strong> ${Assunto || 'N/A'}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${Mensagem.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
