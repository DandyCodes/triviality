import decode from "jwt-decode";

class ClientAuth {
  getDecodedToken() {
    return decode(this.getToken());
  }

  isLoggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decodedToken = decode(token);
      return decodedToken.exp < Date.now() * 0.001;
    } catch (err) {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  onLogin(idToken) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  onLogout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

export default new ClientAuth();
