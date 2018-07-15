import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    prodName: String,
    quantity: { type: Number, default: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Order', schema);