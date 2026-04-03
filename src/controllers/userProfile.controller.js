import asyncHandler from "express-async-handler";
import {
    createProfileService,
    deleteProfileService,
    getProfileService,
    updateProfileService,
} from "../services/userProfile.service.js";

export const getProfile = asyncHandler(async (req, res) => {
    const profile = await getProfileService("69cf8fb3ffdd70aef8de5573");
    res.status(200).json({ profile });
});

export const createProfile = asyncHandler(async (req, res) => {
    const profile = await createProfileService("69cf8fb3ffdd70aef8de5573", req.body);
    res.status(201).json({ profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const profile = await updateProfileService("69cf8fb3ffdd70aef8de5573", req.body);
    res.status(200).json({ profile });
});

export const deleteProfile = asyncHandler(async (req, res) => {
    const profile = await deleteProfileService("69cf8fb3ffdd70aef8de5573");
    res.status(200).json({ message: "Profile Deleted Succussfully" });
});
