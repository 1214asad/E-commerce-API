const mongoose = require("mongoose");
const Review = require("./Review");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot be more than 50"],
      required: [true, "provide name of your product"],
    },
    price: {
      type: Number,
      required: [true, "provide price of you product."],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "provide description about your product"],
      maxlength: [1000, "description  cannot be more than 1000"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "please provide catogory"],
      enum: ["office", "kitchen", "bedroom", "electronics"],
    },
    company: {
      type: String,
      required: [true, "please provide company"],
      enum: {
        values: ["ikea", "liddy", "marcos", "boat"],
        message: "{Value} is not supported.",
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShiping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 4,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
ProductSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.methods.removeReviews = async function (next) {
  await Review.deleteMany({ product: this._id })
    .then((result) => console.log("remove revies ", result))
    .catch((err) => console.log(err));
};

module.exports = mongoose.model("Product", ProductSchema);
