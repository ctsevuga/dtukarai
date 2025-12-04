// controllers/borrowerController.js

import Borrower from "../models/borrowerModel.js";

/**
 * @desc Create a new borrower
 * @route POST /api/borrowers
 * @access Admin
 */
const createBorrower = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // Check duplicate phone
    const exists = await Borrower.findOne({ phone });
    if (exists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const borrower = await Borrower.create({ name, phone });

    res.status(201).json({
      message: "Borrower created successfully",
      borrower
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all borrowers
 * @route GET /api/borrowers
 * @access Admin / Agent
 */
const getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find().sort({ createdAt: -1 });

    res.status(200).json(borrowers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get borrower by ID
 * @route GET /api/borrowers/:id
 * @access Admin / Agent
 */
const getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);

    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }

    res.status(200).json(borrower);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Search borrower by phone
 * @route GET /api/borrowers/search/:phone
 * @access Admin / Agent
 */
const searchBorrowerByPhone = async (req, res) => {
  try {
    const borrower = await Borrower.findOne({ phone: req.params.phone });

    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }

    res.status(200).json(borrower);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update borrower details
 * @route PUT /api/borrowers/:id
 * @access Admin
 */
const updateBorrower = async (req, res) => {
  try {
    const { name, phone, isActive } = req.body;

    const borrower = await Borrower.findById(req.params.id);

    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }

    // If updating phone, ensure no duplicates
    if (phone && phone !== borrower.phone) {
      const phoneExists = await Borrower.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone already in use" });
      }
    }

    borrower.name = name || borrower.name;
    borrower.phone = phone || borrower.phone;
    if (isActive !== undefined) borrower.isActive = isActive;

    await borrower.save();

    res.status(200).json({
      message: "Borrower updated successfully",
      borrower
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Soft delete borrower (set isActive = false)
 * @route DELETE /api/borrowers/:id
 * @access Admin
 */
const deactivateBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);

    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }

    borrower.isActive = false;
    await borrower.save();

    res.status(200).json({
      message: "Borrower deactivated successfully",
      borrower
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  createBorrower,
  getAllBorrowers,
  getBorrowerById,
  searchBorrowerByPhone,
  updateBorrower,
  deactivateBorrower
};
