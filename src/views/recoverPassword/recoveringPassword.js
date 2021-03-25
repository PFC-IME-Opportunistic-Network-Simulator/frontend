import React from 'react'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import EmailService from '../../app/service/emailService'
import * as popUp from '../../components/toastr'
import HandleErrorService from '../../app/service/handleErrorService'
import UserService from '../../app/service/userService'
import { Button } from 'primereact/button'

class RecoveringPassWord extends React.Component {

    constructor(){
        super();
        this.emailService = new EmailService();
        this.userService = new UserService();
    }

    state = {
        email: null,
        newPassword: '',
        confirmNewPassword: '',
        errorNewPasswordMessage: null, 
        inputNewPasswordErrorClass: null,
        errorConfirmNewPasswordMessage: null,
        inputConfirmNewPasswordErrorClass: null,
        confirmButtonMessage: 'Confirmar',
        disableConfirmButton: false

    }

    componentDidMount() {
        this.userService.getUserFromEmailAndHash(this.props.email, this.props.hash)
        .then(response => {
            this.setState( {email: response.data.email} )
        }).catch(error => {
            HandleErrorService.handleError(this.props.push, error)
        })
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.key === "Enter") {
        this.redefinePassword();
      }
    }

    checkData = () => {
        var check = true

        if(!this.state.newPassword){
            this.setState({errorNewPasswordMessage: "Campo senha é obrigatório"})
            this.setState({inputNewPasswordErrorClass: "is-invalid"})    
            check=false        
        }
        if(!this.state.confirmNewPassword){
            this.setState({errorConfirmNewPasswordMessage: "Campo confirmação de senha é obrigatório"})
            this.setState({inputConfirmNewPasswordErrorClass: "is-invalid"})    
            check=false  
        }
        if(this.state.newPassword && this.state.confirmNewPassword && this.state.newPassword !== this.state.confirmNewPassword){
            console.log('entrou')
            this.setState({errorConfirmNewPasswordMessage: "As senhas não conferem"})
            this.setState({inputConfirmNewPasswordErrorClass: "is-invalid"})
            check=false
        }
        return check
    }

    resetView = () => {
        this.setState( {errorNewPasswordMessage: null} )
        this.setState( {inputNewPasswordErrorClass: null} )
        this.setState( {errorConfirmNewPasswordMessage: null} )
        this.setState( {inputConfirmNewPasswordErrorClass: null} )
    }

    redefinePassword = () => {
        
        this.resetView()

        if(this.checkData())
        {   
            this.setState({confirmButtonMessage: 'Enviando...'})
            this.setState({disableConfirmButton: true}) 
            this.userService.redefinePassword(this.props.email, this.props.hash, {
                passwd: this.state.newPassword
            }).then(response => {
                popUp.successPopUp("Senha alterada com sucesso")
                this.props.push('/login')
            }).catch(error => {
                HandleErrorService.handleError(this.props.push, error)
                this.setState({confirmButtonMessage: 'Confirmar'})
                this.setState({disableConfirmButton: false})
            })
        }
    }

    render(){
        if(this.state.email)
        {
            return(
                        <div className="bs-docs-section">
                            <div className = "col-md-3 d-flex "
                                style ={{margin: '0 auto'}} >
                            <Card title = "Redefinir Senha">
                                <fieldset>
                                    <FormGroup label = "Email: " htmlFor = "email">
                                        <input type="email"
                                        className={"form-control "}
                                        value = {this.state.email}
                                        id="exampleInputEmail1"
                                        aria-describedby="email"
                                        disabled />
                                    </FormGroup>
                                    <FormGroup label = "Nova Senha: " htmlFor = "newPasswd">
                                        <input type="password"
                                        className={"form-control " + this.state.inputNewPasswordErrorClass }
                                        id="newPasswd"
                                        name="newPassword"
                                        value = {this.state.newPassword}
                                        onChange = { this.handleChange }
                                        onKeyPress={this.handleKeypress}
                                        placeholder="Password" />
                                        <div className="invalid-feedback">{this.state.errorNewPasswordMessage}</div>
                                    </FormGroup>
                                    <FormGroup label = "Confirmação da nova Senha: " htmlFor = "confNewPasswd">
                                        <input type="password"
                                        className={"form-control " + this.state.inputConfirmNewPasswordErrorClass}
                                        id="confirmPasswd"
                                        name="confirmNewPassword"
                                        value = {this.state.confirmNewPassword}
                                        onChange = { this.handleChange }
                                        onKeyPress={this.handleKeypress}
                                        placeholder="Password" />
                                        <div className="invalid-feedback">{this.state.errorConfirmNewPasswordMessage}</div>
                                    </FormGroup>
                                    <Button 
                                        label={this.state.confirmButtonMessage}
                                        icon="pi pi-check-circle"
                                        onClick={this.redefinePassword}
                                        style={ {maxHeight: '35px'} }
                                        disabled={this.state.disableConfirmButton}
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
             
        )}

        return false
    }

}

export default RecoveringPassWord