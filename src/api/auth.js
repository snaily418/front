import { request } from "./api";

export const auth = (username, password) =>
  request("post", "/token", { username, password }, false);

export const register = (username, email, password) =>
  request("post", "/register", { username, email, password }, false);
