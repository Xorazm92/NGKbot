import { Router } from 'express';
import User from '../models/user.js';  

const router = Router();

// Barcha foydalanuvchilarni olish
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Foydalanuvchilarni olishda xatolik' });
  }
});

// Foydalanuvchi ma'lumotlarini olish
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Foydalanuvchi ma\'lumotlarini olishda xatolik' });
  }
});

// Foydalanuvchini o'chirish
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }

    res.json({ message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Foydalanuvchini o\'chirishda xatolik' });
  }
});

export default router;
