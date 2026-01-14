const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    desc: { type: String, required: true, trim: true },
    chef: { type: String, trim: true },
    category: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'dessert', ''],
      default: '',
    },
    ingr: { type: String, trim: true },
    inst: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
    },
  }
);

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;
