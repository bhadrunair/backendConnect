import axios from "axios";
import { string } from "zod";

const fetcher = async<T>(url: string, headers = {}): Promise<T|null> => {
    try{
        const {data} = await axios.get<T>(`${url}`, {headers, withCredentials: true});
        return data;
    }catch{
        return null;
    }
}

export default fetcher;