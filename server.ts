import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Contact API with SMTP
  app.post('/api/contact', async (req, res) => {
    const { Nome, Email, Telefone, Servico, Assunto, Mensagem } = req.body;

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
      subject: `Novo Contato: ${Assunto} - ${Servico}`,
      text: `
        Nome: ${Nome}
        Email: ${Email}
        Telefone: ${Telefone}
        Serviço: ${Servico}
        Assunto: ${Assunto}
        
        Mensagem:
        ${Mensagem}
      `,
      html: `
        <h3>Novo Contato do Site</h3>
        <p><strong>Nome:</strong> ${Nome}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Telefone:</strong> ${Telefone}</p>
        <p><strong>Serviço:</strong> ${Servico}</p>
        <p><strong>Assunto:</strong> ${Assunto}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${Mensagem.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('SMTP Error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Master Access Validation API
  app.post('/api/validate-master-access', (req, res) => {
    const { password, honeypot } = req.body;

    // Basic honeypot check
    if (honeypot) {
      return res.status(403).json({ success: false, error: 'Acesso negado.' });
    }

    const masterPassword = process.env.MASTER_PASSWORD || 'Bruno.eng2026';

    if (password === masterPassword) {
      return res.json({ 
        success: true, 
        token: 'access_granted_be' 
      });
    }

    return res.status(401).json({ success: false, error: 'Chave de acesso inválida.' });
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
