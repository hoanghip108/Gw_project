const baseRoute = "http://localhost:5000";
const routes = {
  login: baseRoute + "/api/users/auth/login",
  getContacts: baseRoute + "/api/users",
};
export { routes, baseRoute };
