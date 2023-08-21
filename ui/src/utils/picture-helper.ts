import { getBaseUrlServer } from "./url-helper";
import { Cookie } from "./auth-helper";

export async function fetchProfilePicture(userId: string) {
  const URIGetImage = `${getBaseUrlServer()}users/upload/${userId}`;
  const res = await fetch(URIGetImage, {
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem(Cookie.TOKEN)}`,
    }),
  });
  // convert the response object to a blob
  const imageBlob = await res.blob();
  return imageBlob;
}
