import axios from "axios";
import { parseCookies } from "nookies";
import process from "process";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME as string;
const cookies = parseCookies(null);
const token = cookies[COOKIE_NAME];

if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
};
