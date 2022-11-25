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

function getCurrentProfile(abort?: AbortController) {
  return AxiosInstance.get(`/users/profile`, {
    signal: abort ? abort.signal : undefined,
  });
}

const UserRequest = { postSignUpUser, postSignInUser, getCurrentProfile };
export default UserRequest;
