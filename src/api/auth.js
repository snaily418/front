import { request } from "./api";

export const auth = (username, password) =>
  request("post", "/auth", { username, password }, false);
