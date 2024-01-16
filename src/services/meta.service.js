import axios from "axios"

const urlMeta = "https://graph.facebook.com/v17.0/106430075725576"

export function Meta(){

    let token = "EAADEAeFTQbkBO8ZB2VFjZCokXVFhDgNbNpcSZBCaTesJtBZAJS6duBEw4BhLOJXojeP833u3H8ZChHPfta2PNff5oOglq4KjKc90CZB6Hji5p4vTxZBIIlWr9VRFs0TxxdiKTN8EHa8ciaj458sXRxaDvqq85rBBr5ZChqOBpywGgdSJ4hBci3vZCSOvwldH5sUTIRrAJbXsPyLD7JgQwdd8ZD";

    const api = axios.create({
        baseURL: urlMeta,
        headers:{
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
        }
        
    });

    return api;
} 