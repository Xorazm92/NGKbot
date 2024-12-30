import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'approved', 'rejected'],
        default: 'new'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
