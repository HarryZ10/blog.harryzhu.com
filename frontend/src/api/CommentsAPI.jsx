// src/api/CommentsAPI.js
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://10.10.10.25:80';
