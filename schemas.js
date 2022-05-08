const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.roomSchema = Joi.object({
    room: Joi.object({
        rent: Joi.number().required().min(0),
        deposit: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        address: Joi.string().required().escapeHTML(),
        neighbourhood: Joi.string().required().escapeHTML(),
        ageMin: Joi.number().required().min(0),
        ageMax: Joi.number().required().min(0),
        slogan: Joi.string().required().escapeHTML(),
        minStay: Joi.string().required().escapeHTML(),
        mateMale: Joi.string().required().escapeHTML(),
        mateFemale: Joi.string().required().escapeHTML(),
        city: Joi.string().required().escapeHTML(),
        bed: Joi.string().required().escapeHTML(),
        ensuite: Joi.string().required().escapeHTML(),
        bills: Joi.string().required().escapeHTML(),
        livingAs: Joi.string().required().escapeHTML(),
        status: Joi.string().required().escapeHTML(),
        gender: Joi.string().required().escapeHTML(),
        dateStart: Joi.string().required().escapeHTML(),
        dateEnd: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
})
module.exports.userProfileSchema = Joi.object({
    roommate: Joi.object({
        name: Joi.string().required().escapeHTML(),
        city: Joi.string().required().escapeHTML(),
        dob: Joi.string().required().escapeHTML(),
        gender: Joi.string().required().escapeHTML(),
        status: Joi.string().required().escapeHTML(),
        livingAs: Joi.string().required().escapeHTML(),
        budget: Joi.string().required().escapeHTML(),
        idealMoveDate: Joi.string().required().escapeHTML(),
        lookingForRooms: Joi.string().required().escapeHTML(),
        lookingTeamUP: Joi.string().required().escapeHTML(),
        profilePrivacy: Joi.string().required().escapeHTML(),
        bio: Joi.string().required().escapeHTML(),
    }).required(),
})
