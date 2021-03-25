import React from 'react'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import EmailService from '../../app/service/emailService'
import * as popUp from '../../components/toastr'
import HandleErrorService from '../../app/service/handleErrorService'
import ReactLoading from "react-loading"
import { Button } from 'primereact/button'

class RequestToRecoverPassWord extends React.Component {

    constructor(){
        super();
        this.emailService = new EmailService();
    }

    state = {
        email: null,
        loading: false
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.key === "Enter") {
        this.recoverPassword();
      }
    }

    recoverPassword = () => {
        this.setState({loading: true})
        this.emailService.recoverPassword({
            email: this.state.email,
            url: window.location.href
        }).then(response => {
            this.setState({loading: false})
            popUp.successPopUp('Link para recuperação de senha enviado por email')
            this.props.push('/login')
        }).catch(error => {
            this.setState({loading: false})
            HandleErrorService.handleError(this.props.push, error)
        })
        
    }

    render() {
        if(this.state.loading){
            return (
                <div 
                style = { { display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '600px'} }>
                      <ReactLoading type={"bars"} color={"#ffffff"} />
                </div>
             )
        }
        else
        {   
            return(
                        <div className="bs-docs-section">
                            <div className = "col-md-3 d-flex "
                                style ={{margin: 'auto'}} >
                            <Card title = "Recuperar Senha">
                                <fieldset>
                                    <FormGroup label = "Email: " htmlFor = "email">
                                        <input type="email"
                                        className={"form-control "}
                                        name="email"
                                        value = {this.state.email}
                                        id="exampleInputEmail1"
                                        aria-describedby="emailHelp"
                                        placeholder="Digite o Email"
                                        onChange={this.handleChange}
                                        onKeyPress={this.handleKeypress}/>
                                    </FormGroup>
                                    <Button 
                                        label="Enviar"
                                        icon="pi pi-check-circle"
                                        onClick={this.recoverPassword}
                                        style={ {maxHeight: '35px'} }
                                        />
                                    <Button 
                                        label="Cancelar"
                                        className="p-button-danger"
                                        icon="pi pi-times"
                                        onClick={() => this.props.push('/Login')}
                                        style={ {maxHeight: '35px', marginLeft: '8px'} }
                                        />
                                
                                </fieldset>
                            </Card>
                        </div>
                        </div>
            )
        }
    }
}

export default RequestToRecoverPassWord