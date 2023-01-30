import {getBaseUrl} from "../utils/url-helper";

class AuthService {
  stateKey = "UnguessableKeyWithAnImmenseLength";

  private generateState(): string {
    return "TODO";
  }

  createAndSaveState(): string {
    const toReturn = this.generateState();

    sessionStorage.setItem(this.stateKey, toReturn); // For now

    return toReturn;
  }

  checkState(state: string): boolean {
    return sessionStorage.getItem(this.stateKey) === state; // For now
  }

  removeState(): void {
    sessionStorage.removeItem(this.stateKey);
  }

  createAuthURI(): string {
    /*
     * Callback URI needs to be changed in intra
     * to something like "http://localhost:3000/login/callback".
     *
     *                                            - mhahnFr
     */
    return `https://api.intra.42.fr/oauth/authorize?response_type=code&client_id=${
      process.env.REACT_APP_CLIENT_ID
    }&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fintra42%2Fcallback&state=${this.createAndSaveState()}`;
  }

  getAuthURI(): string {
    return `${getBaseUrl()}auth/intra42`;
  }
}

export default new AuthService();
