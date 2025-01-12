import mongoose from 'mongoose';

const literatureSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['interesting_info', 'sample_forms', 'required_docs', 'video_tutorials']
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    isVideo: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Literature = mongoose.models.Literature || mongoose.model('Literature', literatureSchema);
export default Literature;
