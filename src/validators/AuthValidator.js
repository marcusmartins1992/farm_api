const { checkSchema } = require('express-validator');

module.exports = {
    signup: checkSchema({
        name: {
            notEmpty: true,
            trim: true,
            isLength:{
                options: { min:2 }
            },
            errorMessage: 'Name must be at least 5 characters long'
        },
        email: {
            notEmpty: true,
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail is invalid'
        },
        password: {
            notEmpty: true,
            isLength:{
                options:{ min:5 }
            },
            errorMessage: 'Name must be at least 5 characters long'
        },
        idFarm: {
            notEmpty: true,
            errorMessage: 'Farm is required'
        }
    }),
    signin: checkSchema ({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail invalid'
        },
        password: {
            notEmpty: true,
            isLength:{
                options:{ min:2 }
            },
            errorMessage: 'Name must be at least 5 characters long'
        }
    })
};