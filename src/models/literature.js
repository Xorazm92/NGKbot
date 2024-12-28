import mongoose from 'mongoose';

const LiteratureSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    default: 'Boshqa' 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Literature = mongoose.model('Literature', LiteratureSchema);
