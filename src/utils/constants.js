import Swal from "sweetalert2";

export const CLIENT_ID = '307c7b766f704a5ba98490cf18bcb9e9';
export const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const RESPONSE_TYPE = "token";
export const REDIRECT_URI = "https://music-playlist-client.vercel.app/search";
// export const REDIRECT_URI = "http://localhost:3000/search";

// Regex for Email Address.
export const emailRegx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Regex for Name.
export const noSpeacialCharRegx = /^[A-Za-z.]+$/i;
export const nameRegex = /^[A-Za-z.\s]+$/i;

// Regex for Password.
export const passwordRegx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;

export const toast = (msg, type) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  Toast.fire({
    icon: type,
    title: msg,
  });
};