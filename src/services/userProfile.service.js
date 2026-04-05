import UserProfile from "../models/userProfile.js";
import CustomError from "../utils/customError.js";

export const getProfileService = async (userId) => {
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
        throw new CustomError("UserProfile not found", 404);
    }

    console.log(userProfile);
    return userProfile;
};

export const createProfileService = async (userId, usrData) => {
    const userExists = await UserProfile.findOne({ userId });

    if (userExists) {
        throw new CustomError("User already has a profile", 400);
    }

    const userProfile = await UserProfile.create({
        userId,
        ...usrData,
    });

    console.log(userProfile);

    return userProfile;
};

export const updateProfileService = async (userId, userData) => {
    const userProfile = await UserProfile.findOneAndUpdate(
        { userId: userId },
        userData,
        { new: true, runValidators: true },
    );

    if (!userProfile) {
        throw new CustomError("Profile not found", 404);
    }

    return userProfile;
};

export const deleteProfileService = async (userId) => {
    const userProfile = await UserProfile.findOneAndDelete({ userId });
    if (!userProfile) {
        throw new CustomError("Profile not found", 404);
    }
    return true;
};
