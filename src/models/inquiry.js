import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  userId: { 
    type: Number, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Inquiry = mongoose.model('Inquiry', InquirySchema);
