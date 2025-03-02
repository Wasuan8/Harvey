import * as Yup from "yup";
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const validEmail = Yup.string().email().required("Enter your email")
const validDate = Yup.string().required("Enter the date");
const validFname = Yup.string()
    .min(2, "FirstName must be greater than 1 word")
    .max(25)
    .required("First Name is required");

const validPhoneNumber = /^(?:\+1\s?)?\(?([2-9][0-9]{2})\)?[\s\-]?[2-9][0-9]{2}[\s\-]?[0-9]{4}$/; // Regex for US phone numbers

export const signInSchema = Yup.object({
    email: validEmail,
    password: Yup.string()
        .matches(passwordRules, { message: "Password is weak" })
        .required("Password is required"),
});

export const signUpSchema = Yup.object({
    username: Yup.string()
        .min(2, "Name must be greater than 1 word")
        .max(25)
        .required("Name is required"),

    email: validEmail,
    password: Yup.string()
        .matches(passwordRules, { message: "Create a stronger password" })
        .required("Enter the password."),
    number: Yup.string()
        .matches(validPhoneNumber, 'Phone number is not valid. Please use a valid US phone number.')
        .required('Phone number is required.'),

    cpassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm your password.'),
});

export const ForgotePassword = Yup.object({
    email: validEmail,


});
export const PasswordSchema = Yup.object({
    newPassword: Yup.string()
        .matches(passwordRules, { message: "Create a stronger password" })
        .required("Enter the password."),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm your password.'),

})

export const SchemaAmountPay = Yup.object({
    category: Yup.string().required("Category is required"),
    amount: Yup.string().required("amount is required"),

})