import { body } from 'express-validator';
/*
export enum MotorStatus {
    Available = 'available',
    Unavailable = 'unavailable',
    Reserved = 'reserved',
    Rented = 'rented',
    Deleted = 'deleted'
}
*/
export const createMotorValidations = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('model').notEmpty().withMessage('Model is required'),
    body('year').isNumeric().notEmpty().withMessage('Year is required'),
    body('image').notEmpty().withMessage('Image is required'),
    // status is not emtpy and is one of the values in MotorStatus
    body('status').notEmpty().withMessage('Status is required')
    .isIn(['available', 'unavailable', 'reserved', 'rented', 'deleted']).withMessage('Status is not valid')
]


// update motor validations
// description, image, status -> all optional
export const updateMotorValidations = [
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('model').optional().notEmpty().withMessage('Model is required'),
    body('year').optional().isNumeric().notEmpty().withMessage('Year is required'),
    body('image').optional().notEmpty().withMessage('Image is required'),
    // status is not emtpy and is one of the values in MotorStatus
    body('status').optional().notEmpty().withMessage('Status is required')
    .isIn(['available', 'unavailable', 'reserved', 'rented', 'deleted']).withMessage('Status is not valid')
]
