// const base="http://162.243.168.223:5000/api"

export const base="http://162.243.168.223:5000/api"
export const baseImage = "http://162.243.168.223:5000"

//Login API
export const LoginURl = base + '/auth/login';
export const RegistrationURL = base + '/auth/signup';
export const UpdateProfile = base + '/auth/update-profile';
export const LogoutProfile = base + '/auth/logout/';


//Forgot Password
export const EmailVerifyPassword = base + '/auth/forgot-password';
export const OTPVerifyPassowrd = base + '/auth/verify-otp';
export const PasswordReset = base + '/auth/reset-password';

//Add Category 
export const CategoryGetRT = base + '/category/get';
export const CategoryADDRT = base + '/category/add';
export const CategoryUpdateRT = base + '/category/update/';
export const CategoryDeleteRT = base + '/category/delete/';

//Namaj API
export const AddPrayer =  base + '/prayer/addPrayerTime';
export const GetAllPrayer =  base + '/prayer/get';
export const UpdatePrayer =  base + '/prayer/updatePrayerTime'; //Put Method
export const GetMonthPrayer =  base + '/prayer/getPrayerTimes'; //Get Method
export const DeletePrayerBYId =  base + '/prayer/'; //delete Method


//Payment Method 

export const CreatePayment =  base + '/payments/create-payment'; //Post 
export const ConfirmPayment =  base + '/payments/confirm-payment'; //Post 
export const CancelPayment = base + '/'








