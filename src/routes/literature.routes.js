import { Router } from 'express';
import { Literature } from '../models/index.js';

const router = Router();

// Adabiyotni yuklash
router.post('/upload', async (req, res) => {
  try {
    const { name, fileUrl, category } = req.body;
    
    const literature = new Literature({
      name,
      fileUrl,
      category
    });

    await literature.save();

    res.status(201).json({
      message: 'Adabiyot muvaffaqiyatli yuklandi',
      literature
    });
  } catch (error) {
    res.status(500).json({ error: 'Adabiyotni yuklashda xatolik' });
  }
});

// Barcha adabiyotlarni olish
router.get('/', async (req, res) => {
  try {
    const literatures = await Literature.find({});
    res.status(200).json(literatures);
  } catch (error) {
    res.status(500).json({ error: 'Adabiyotlarni olishda xatolik' });
  }
});

export default router;
