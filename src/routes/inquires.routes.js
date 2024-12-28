import { Router } from 'express';
import { Inquiry } from '../models/index.js';

const router = Router();

// Barcha murojaatlarni olish
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Murojaatlarni olishda xatolik' });
  }
});

// Murojaat holatini o'zgartirish
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Murojaat topilmadi' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Murojaat holatini o\'zgartirishda xatolik' });
  }
});

// Murojaat ma'lumotlarini olish
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Murojaat topilmadi' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Murojaat ma\'lumotlarini olishda xatolik' });
  }
});

export default router;
