const joi=require('joi')
//signup joischema
const joiUserSchema=joi.object({
    username:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().required(),
    cpassword:joi.string().required(),
    // address:joi.string().required(),
    // phonenumber:joi.number().required(),
    admin:joi.boolean().optional(),
    block:joi.boolean().optional()
})

//login schema
const joiLoginSchema=joi.object({
    username:joi.string(),
    password:joi.string()

})


//product joi schema

const joiProductSchema=joi.object({
    name:joi.string(),
    category:joi.string(),
    price:joi.number(),
    image:joi.string(),
    qty:joi.number(),
    description:joi.string(),
    brand:joi.string(),
    rating:joi.number(),
    reviews:joi.number()

}).unknown(true)


//adress joi schema

const joiAddressSchema = joi.object({
    Name: joi.string().required().messages({
      "string.empty": "Full Name is required.",
    }),
    phoneNumber: joi.number().required().messages({ //.pattern(/^[0-9]{10}$/)
      "number.empty": "Phone number is required.",
      "number.pattern.base": "Phone number must be a 10-digit number.",
    }),
    alternatePhoneNumber: joi.number().optional().messages({//.pattern(/^[0-9]{10}$/)
      "number.pattern.base": "Alternate phone number must be a 10-digit number.",
    }),
    pincode: joi.number().required().messages({//.pattern(/^[0-9]{6}$/)
      "number.empty": "Pincode is required.",
      "number.pattern.base": "Pincode must be a 6-digit number.",
    }),
    state: joi.string().required().messages({
      "string.empty": "State is required.",
    }),
    city: joi.string().required().messages({
      "string.empty": "City is required.",
    }),
    buildingName: joi.string().required().messages({
      "string.empty": "House No., Building Name is required.",
    }),
    roadAreaColony: joi.string().required().messages({
      "string.empty": "Road name, Area, Colony is required.",
    }),
    landmark: joi.string().optional(),
  });
  
 
module.exports={joiUserSchema,joiLoginSchema,joiProductSchema,joiAddressSchema}