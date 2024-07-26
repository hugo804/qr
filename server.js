const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());

app.post('/leituray', async (req, res) => {
  const { qrCode } = req.body;

  try {
    const existingQRCode = await prisma.qRCode.findUnique({
      where: { qrCode: qrCode }
    });

    if (existingQRCode) {
      return res.status(400).send('QR code já lido');
    }

    const newQRCode = await prisma.qRCode.create({
      data: { qrCode: qrCode }
    });

    res.status(200).send('QR code registrado');
  } catch (error) {
    res.status(500).send('Erro ao registrar o QR code');
  }
});

app.get('/qrCodesLidos', async (req, res) => {
  try {
    const qrCodes = await prisma.qRCode.findMany();
    res.json(qrCodes);
  } catch (error) {
    res.status(500).send('Erro ao buscar os QR codes lidos');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
