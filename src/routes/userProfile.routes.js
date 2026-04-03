import express from "express";
const router = express.Router();

import {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
} from "../controllers/userProfile.controller.js";

import validateRequest from "../middlewares/validateRequest.js";

import {
    createProfileValidator,
    updateProfileValidator,
} from "../validators/userProfile.validator.js";

router
    .route("/")
    .get(validateRequest, getProfile)
    .post(createProfileValidator, validateRequest, createProfile)
    .patch(updateProfileValidator, validateRequest, updateProfile)
    .delete(deleteProfile);

export default router;
