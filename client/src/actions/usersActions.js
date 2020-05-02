export const fetchUsers = () => {
  return {
    type: "REQUEST_USERS",
    method: "GET",
    route: "users"
  };
};
