import { warningPopUp, errorPopUp } from "../../components/toastr"

class HandleErrorService {

    static handleError(push, error){
        const response = error.response
        if(response){
            if(response.status === 401){
            if(push) push('/login')
            warningPopUp('Login expirado')
             }
            else {
                errorPopUp(response.data)
            }
            return
        }
        if(!error.status){
            warningPopUp('Falha de conexão ao servidor. Tente novamente')
            return
        }
    }

}

export default HandleErrorService