import decode from "jwt-decode";

const clientAuth = {
  getDecodedToken() {
    const token = this.getToken();

    return token ? decode(token) : null;
  },

  isLoggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  },

  isTokenExpired(token) {
    const decoded = decode(token);
    if (decoded.exp < Date.now() * 0.001) {
      localStorage.removeItem("id_token");
      window.location.assign("/");
      return true;
    }
    return false;
  },

  getToken() {
    return localStorage.getItem("id_token");
  },

  onLogin(idToken) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  },

  onLogout() {
    localStorage.removeItem("id_token");
    window.location.reload();
  },
};

export default clientAuth;
