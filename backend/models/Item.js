import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  dateLost: Date,
  dateFound: Date,
  imageUrl: String,
  location: String,
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  matchedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


// ✅ Virtual: show public image URL (assumes using local storage or base path)
itemSchema.virtual('imageLink').get(function () {
  return this.imageUrl ? `/uploads/${this.imageUrl}` : null;
});

// ✅ Pre-save hook: auto-fill `dateFound` if item is marked as "found" and date not set
itemSchema.pre('save', function (next) {
  if (this.type === 'found' && !this.dateFound) {
    this.dateFound = new Date();
  }
  next();
});

// ✅ Instance method: check if item is verified
itemSchema.methods.isVerified = function () {
  return this.status === 'verified';
};

const Item = mongoose.model('Item', itemSchema);
export default Item;
