import { db } from '@/firebase/clientApp';
import { collection, getDocs, serverTimestamp } from "firebase/firestore";
export const getTodosGroupedByColum = async() => {
    console.log(typeof serverTimestamp);
    
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
}