import AxiosInstance from "./AxiosInstance";

function postSignUpUser({ phone, email, firstName, lastName, password }) {
  return AxiosInstance.post("/users/register", {
    phone,
    email,
    firstName,
    lastName,
    password,
  });
}

function postSignInUser({ phoneOrEmail, password }) {
  return AxiosInstance.post("/auth/login", {
    phoneOrEmail,
    password,
  });
}

const UserRequest = { postSignUpUser, postSignInUser };
export default UserRequest;
