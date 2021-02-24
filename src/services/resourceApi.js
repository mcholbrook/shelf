import tokenService from "../services/tokenService";
const BASE_URL = "/api/resources/";

export function create(resourceData){
    return fetch(
        `${BASE_URL}createresource`, 
        {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + tokenService.getToken(),
            },
            body: JSON.stringify(resourceData)
          },
          { mode: "cors" }   
    )
    .then((res) => res.json())
}