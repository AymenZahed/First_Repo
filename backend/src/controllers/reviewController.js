const Review = require('../models/Review');
const Application = require('../models/Application');

exports.createReview = async (req, res) => {
  try {
    const { mission, reviewee, rating, comment, categories } = req.body;

    const application = await Application.findOne({
      mission,
      $or: [
        { volunteer: req.user._id },
        { volunteer: reviewee }
      ],
      status: 'completed'
    });

    if (!application) {
      return res.status(400).json({ message: 'Can only review completed missions' });
    }

    const review = await Review.create({
      mission,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
      categories,
      isVerified: true
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'firstName lastName organizationName profilePicture logo')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
