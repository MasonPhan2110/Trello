import { storage } from "@/firebase/clientApp";
import { getDownloadURL, ref } from "firebase/storage";

const getURL = async(image: string) => {
    const storageRef = ref(storage);
    const imagesRef = ref(storageRef, image);
    const url = await getDownloadURL(imagesRef);
    console.log("url",url);

    return url;
    
}
export default getURL;