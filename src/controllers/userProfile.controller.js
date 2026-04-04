import asyncHandler from "express-async-handler";
import {
    createProfileService,
    deleteProfileService,
    getProfileService,
    updateProfileService,
} from "../services/userProfile.service.js";

export const getProfile = asyncHandler(async (req, res) => {
    const profile = await getProfileService(req.user.userId);
    res.status(200).json({ profile });
});

export const createProfile = asyncHandler(async (req, res) => {
    const profile = await createProfileService(req.user.userId, req.body);
    res.status(201).json({ profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const profile = await updateProfileService(req.user.userId, req.body);
    res.status(200).json({ profile });
});

export const deleteProfile = asyncHandler(async (req, res) => {
    const profile = await deleteProfileService(req.user.userId);
    res.status(200).json({ message: "Profile Deleted Succussfully" });
});
