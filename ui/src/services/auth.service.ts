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

  createAuthURI(): string {
    /*
     * Callback URI needs to be changed in intra
     * to something like "http://localhost:3000/login/callback".
     *
     *                                            - mhahnFr
     */
    return `https://api.intra.42.fr/oauth/authorize?client_id=${
      process.env.CLIENT_ID
    }&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fintra42%2Fcallback&state=${this.createAndSaveState()}`;
  }
}

export default new AuthService();
