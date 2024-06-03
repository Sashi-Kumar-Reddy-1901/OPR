import { redirect } from "react-router-dom";

export function getAuthToken(){
    const token = sessionStorage.getItem("token");
    return token;
}


export function checkAuthLoader() {
    // this function will be added in the next lecture
    // make sure it looks like this in the end
    const token = getAuthToken();
    
    if (!token) {
      return redirect('/');
    }
   
    return null; // this is missing in the next lecture video and should be added by you
  }