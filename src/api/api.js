import axios from "axios";

export const BASEURL = "http://localhost:8000";

export const request = (method, url, data = null, auth = true, long = false) =>
  axios.request({
    url: url,
    method: method,
    baseURL: BASEURL,
    data: data,
    ...(long ? {} : { timeout: 10000 }),
    ...(auth
      ? {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      : {}),
  });

export const getMe = () => request("get", `/me`, null);

export const getCategories = () => request("get", `/categories`, null);

export const createCategory = (title) =>
  request("post", `/categories`, { title });

export const deleteCategory = (id) => request("delete", `/categories/${id}`);

export const getTasks = (categoryID) =>
  request("get", `/categories/${categoryID}/tasks`);

export const createTask = (categoryID, title) =>
  request("post", `/categories/${categoryID}/tasks`, {
    title,
    priority: false,
    description: "",
  });

export const checkTask = (categoryID, taskID) =>
  request("post", `/categories/${categoryID}/tasks/${taskID}`);
