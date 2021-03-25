import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import * as popUp from '../components/toastr'
import { withRouter } from 'react-router-dom'
import { AuthContext } from '../main/authProvider'
import UserService from '../app/service/userService'
import HandleErrorService from '../app/service/handleErrorService'
import { Button } from 'primereact/button'

class ChangePassword extends React.Component{

    constructor(){
        super()
        this.userService = new UserService()
    }

    state = {
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        errorPasswordMessage: null, 
        inputPasswordErrorClass: null,
        errorNewPasswordMessage: null, 
        inputNewPasswordErrorClass: null,
        errorConfirmNewPasswordMessage: null,
        inputConfirmNewPasswordErrorClass: null,
        changeButtonMessage: "Confirmar",
        disbaleConfirmButton: false

    }

    componentDidMount(){
        this.setState({email: this.context.userLoggedIn.email})
    }

    handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        this.setState( { [name]: value } )
    }

    checkData = () => {
        var check = true

        if(!this.state.currentPassword){
            this.setState({errorPasswordMessage: "Campo senha é obrigatório"})
            this.setState({inputPasswordErrorClass: "is-invalid"})    
            check=false        
        }
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
        this.setState( {errorPasswordMessage: null} )
        this.setState( {inputPasswordErrorClass: null} )
        this.setState( {errorNewPasswordMessage: null} )
        this.setState( {inputNewPasswordErrorClass: null} )
        this.setState( {errorConfirmNewPasswordMessage: null} )
        this.setState( {inputConfirmNewPasswordErrorClass: null} )
    }

    changePassword = () => {

        this.resetView()

        if(this.checkData()){
            this.setState({changeButtonMessage: 'Alterando...'})
            this.setState({disbaleConfirmButton: true})
            this.userService.changePassword({
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword
            }).then(response => {
                popUp.successPopUp("Senha alterada com sucesso")
                this.props.history.push('/login')
            }).catch(error => {
                HandleErrorService.handleError(this.props.history.push, error)
                this.setState({changeButtonMessage: 'Confirmar'})
                this.setState({disbaleConfirmButton: false})
            })
        }
    }

    handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.key === "Enter") {
        this.changePassword();
      }
    }

    render(){
        return(
                    <div className="bs-docs-section">
                        <div className = "col-md-3 d-flex "
                        style ={{margin: 'auto'}} >
                        <Card title = "Alterar Senha">
                            <fieldset>
                                <FormGroup label = "Email: " htmlFor = "email">
                                    <input type="email"
                                    className={"form-control "}
                                    value = {this.state.email}
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Digite o Email"
                                    disabled />
                                </FormGroup>
                                <FormGroup label = "Senha atual: " htmlFor = "currentPasswd">
                                    <input type="password"
                                    className={"form-control " + this.state.inputPasswordErrorClass}
                                    id="currentPasswd"
                                    name="currentPassword"
                                    value = {this.state.currentPassword}
                                    onChange = { this.handleChange }
                                    onKeyPress={this.handleKeypress}
                                    placeholder="Password" />
                                    <div className="invalid-feedback">{this.state.errorPasswordMessage}</div>
                                </FormGroup>
                                <FormGroup label = "Nova Senha: " htmlFor = "newPasswd">
                                    <input type="password"
                                    className={"form-control " }
                                    id="newPasswd"
                                    name="newPassword"
                                    value = {this.state.newPassword}
                                    onChange = { this.handleChange }
                                    onKeyPress={this.handleKeypress}
                                    placeholder="Password" />
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
                                    label={this.state.changeButtonMessage}
                                    icon="pi pi-check-circle"
                                    onClick={this.changePassword}
                                    style={ {maxHeight: '35px'} }
                                    disabled={this.state.disbaleConfirmButton}
                                    />
                                <Button 
                                    label="Cancelar"
                                    className="p-button-danger"
                                    icon="pi pi-times"
                                    onClick={() => this.props.history.push('/home')}
                                    style={ {maxHeight: '35px', marginLeft: '8px'} }
                                    />
                            
                            </fieldset>
                        </Card>
                    </div>
                    </div>
        )
    }

}
ChangePassword.contextType = AuthContext
export default withRouter( ChangePassword )