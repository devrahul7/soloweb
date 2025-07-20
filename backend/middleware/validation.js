import { body } from 'express-validator';

const registerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
    
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long')
    // .matches(/^(?=.*[a-z])     (?=.*[A-Z])       (?=.*\d)/)
    .matches(/^(?=.*[a-z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, and one number'),
    
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(\+977)?[0-9]{10}$/)
    .withMessage('Please provide a valid Nepali phone number'),
    
  body('address')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters')
    .notEmpty()
    .withMessage('Address is required'),
    
  body('wasteType')
    .trim()
    .notEmpty()
    .withMessage('Primary waste type is required')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export { registerValidation, loginValidation };