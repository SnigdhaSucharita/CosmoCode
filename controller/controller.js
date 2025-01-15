const { Op } = require("sequelize");
const { user: userModel, photo: photoModel, tag: tagModel, searchHistory: searchHistoryModel } = require("../models");
const { doesUserExist, searchImages } = require("../utils/utils");
const { 
        validatePresenceOfUsernameAndEmail,
        validateEmailFormat,
        validateImageUrl,
        validateTagsLength,
        validateTagLength,
        containsNonEmptyStrings
    } = require("../validations/index");

const createNewUser = async (req, res) => {
    const emptyFieldError = validatePresenceOfUsernameAndEmail(req.body);
    if(emptyFieldError.length > 0) return res.status(400).json({emptyFieldError});
    
    const formatError = validateEmailFormat(req.body.email);
    if(formatError) return res.status(400).json({formatError});
    try {
        const { username, email } = req.body;
        const userExists = await doesUserExist(email);
        if(userExists) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const newUser = await userModel.create({
            username: username,
            email: email
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to create user", error });
    }

};

const getPhotosByQuery = async (req, res) => {
    const { query } = req.query;

    if(!query) return res.status(400).json({ error: "A search term is required." });

    try {
        const result = await searchImages(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const savePhotosToCollection = async (req, res) => {
    const { imageUrl, description, altDescription, tags, userId } = req.body;

    if(!validateImageUrl(imageUrl)) return res.status(400).json({ message: "Invaild image URL" });

    if(!validateTagsLength(tags)) return res.status(400).json({ message: "No more than 5 tags allowed." });

    if(!validateTagLength(tags)) return res.status(400).json({ message: "Each tag must not exceed 20 characters." });

    try {
        const newPhoto = await photoModel.create({
            imageUrl,
            description,
            altDescription,
            userId
        });

        res.status(201).json({ message: "Photo saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const addTag = async (req, res) => {
    const { photoId } = req.params;
    const { tags } = req.body;

    if(!containsNonEmptyStrings(tags)) {
        return res.status(400).json({ message: "Tags must be non-empty strings." });
    }

    try {
        const existingTagObjects = await tagModel.findAll({ where: { photoId } });
        const existingTags = existingTagObjects.map(tag => tag.name);
        const totalTags = [...new Set([...existingTags, ...tags])];

        if(totalTags.length > 5) {
            return res.status(400).json({ message: "A photo can have a maximum of 5 tags." });
        }

        const tagsToAdd = tags.filter(tag => !existingTags.includes(tag));
        await tagModel.bulkCreate(tagsToAdd.map(tag => ({ name: tag, photoId })));

        res.status(201).json({ message: "Tags added successfully.", tags: totalTags });
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const searchPhotosByTag = async (req, res) => {
    const { tag, sort = "ASC", userId } = req.query;

    if(!tag || typeof tag !== "string") {
        return res.status(400).json({ message: "A valid tag must be provided." });
    }

    if(!["ASC", "DESC"].includes(sort.toUpperCase())) {
        return res.status(400).json({ message: "sort order must be either ASC or DESC." });
    }

    try {
        if(userId) {
            await searchHistoryModel.create({
                query: tag,
                userId: parseInt(userId)
            });
        }

        const tagRecords = await tagModel.findAll({
            where: { name: tag }
        });
        
        if(tagRecords.length === 0) {
            return res.status(404).json({ message: `No photos found for the tag: ${tag}` });
        }

        const photoIds = tagRecords.map(record => record.photoId);
        const photos = await photoModel.findAll({
            where: { id: { [Op.in]: photoIds } },
            order: [["dateSaved", sort.toUpperCase()]],
            include: {
                model: tagModel,
                attributes: ["name"]
            }
        });

        const response = photos.map(photo => ({
            id: photo.id,
            imageUrl: photo.imageUrl,
            description: photo.description,
            altDescription: photo.altDescription,
            dateSaved: photo.dateSaved,
            tags: photo.tags.map(tag => tag.name)
        }));

        res.json({ photos: response });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getSearchHistory = async (req, res) => {
    const { userId } = req.query;

    if(!userId || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid or missing userId parameter." });
    }

    try {
       const searchHistory = await searchHistoryModel.findAll({
        where: { userId },
        attributes: ["query", "timestamp"],
        order: [["timestamp", "DESC"]]
       });

       res.json({ searchHistory });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { createNewUser, getPhotosByQuery, savePhotosToCollection, addTag, searchPhotosByTag, getSearchHistory };