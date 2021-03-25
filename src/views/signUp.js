import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'
import UserService from '../app/service/userService';
import { Button } from 'primereact/button'
import { successPopUp, errorPopUp } from '../components/toastr';


class SingUp extends React.Component {

    constructor(){
        super();
        this.userService = new UserService();
    }

    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        errorEmailMessage: null,
        inputEmailErrorClass: null,
        errorConfirmPasswordMessage: null,
        inputConfirmPasswordErrorClass: null,
        errorPasswordMessage: null,
        inputPasswordErrorClass: null,
        errorNameMessage: null,
        inputNameErrorClass: null,
        signUpSuccessInputClass: null,
        signUpButtonMessage: 'Cadastrar',
        disableSignUpButton: false
    }
    resetView = () => {
        this.setState({errorEmailMessage: null})
        this.setState({inputEmailErrorClass: null})
        this.setState({errorConfirmPasswordMessage: null})
        this.setState({inputConfirmPasswordErrorClass: null})
        this.setState({errorPasswordMessage: null})
        this.setState({inputPasswordErrorClass: null})
        this.setState({errorNameMessage: null})
        this.setState({inputNameErrorClass: null})
        this.setState({signUpSuccessInputClass: null})

    }
    checkData = () => {
        var check = true

        if(!this.state.name){
            this.setState({errorNameMessage: "Campo nome é obrigatório"})
            this.setState({inputNameErrorClass: "is-invalid"})
            check=false
        }
        if(!this.state.email){
            this.setState({errorEmailMessage: "Campo email é obrigatório"})
            this.setState({inputEmailErrorClass: "is-invalid"})
            check=false
        } else if(!this.state.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)){
            this.setState({errorEmailMessage: "Informe um email válido"})
            this.setState({inputEmailErrorClass: "is-invalid"})
            check=false
        }
        if(!this.state.password){
            this.setState({errorPasswordMessage: "Campo senha é obrigatório"})
            this.setState({inputPasswordErrorClass: "is-invalid"})    
            check=false        
        }
        if(!this.state.confirmPassword){
            this.setState({errorConfirmPasswordMessage: "Campo confirmação de senha é obrigatório"})
            this.setState({inputConfirmPasswordErrorClass: "is-invalid"})    
            check=false  
        }
        if(this.state.password && this.state.confirmPassword && this.state.password !== this.state.confirmPassword){
            this.setState({errorConfirmPasswordMessage: "As senhas não conferem"})
            this.setState({inputConfirmPasswordErrorClass: "is-invalid"})
            check=false
        }
        return check
    }

    signUp = () => {
        this.resetView()
        if(this.checkData()){
            this.setState({signUpButtonMessage: 'Cadastrando...'})
            this.setState({disableSignUpButton: true})
            this.userService.signUp({
                name: this.state.name,
                email: this.state.email,
                passwd: this.state.password
            }).then(response => {
                successPopUp('Usuário cadastrado com sucesso')
                this.setState({signUpSuccessInputClass: "is-valid"})
                this.props.history.push('/login')
            }).catch(error => {
                var data = error.response.data
                errorPopUp(data)              
                this.setState({signUpButtonMessage: 'Cadastrar'})
                this.setState({disableSignUpButton: false})  
            })
        }
    }

    cancel = () => {
        this.props.history.push('/login')
    }

    handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.key === "Enter") {
        this.signUp();
      }
    }

    render(){
        return(
                    <div className="bs-docs-section">
                        <div className = "col-md-3 d-flex "
                        style ={{margin: 'auto'}} >
                        <Card title = "Cadastro de Usuário">
                        <fieldset>
                                <FormGroup label = "Nome: " htmlFor = "InputName">
                                    <input type="text"
                                    className={"form-control " + this.state.signUpSuccessInputClass + " "
                                                + this.state.inputNameErrorClass}
                                    name = "name"
                                    value = {this.state.name}
                                    onChange = {e => this.setState({name: e.target.value})}
                                    onKeyPress={this.handleKeypress}
                                    id="InputName"
                                    aria-describedby="NameHelp"
                                    placeholder="Digite seu nome" />
                                    <div className="invalid-feedback">{this.state.errorNameMessage}</div>
                                </FormGroup>
                                <FormGroup label = "Email: " htmlFor = "InputEmail">
                                    <input type="email"
                                    className={"form-control " + this.state.signUpSuccessInputClass + " "
                                                + this.state.inputEmailErrorClass}
                                    name = "email"
                                    value = {this.state.email}
                                    onChange = {e => this.setState({email: e.target.value})}
                                    onKeyPress={this.handleKeypress}
                                    id="InputEmail"
                                    aria-describedby="emailHelp"
                                    placeholder="Digite seu Email" />
                                    <div className="invalid-feedback">{this.state.errorEmailMessage}</div>
                                </FormGroup>
                                <FormGroup label = "Senha: " htmlFor = "InputPassword">
                                    <input type="password"
                                    className={"form-control " + this.state.signUpSuccessInputClass + " "
                                                + this.state.inputPasswordErrorClass}
                                    name = "password"
                                    value = {this.state.password}
                                    onChange = {e => this.setState({password: e.target.value})}
                                    onKeyPress={this.handleKeypress}
                                    id="InputPassword"
                                    placeholder="Digite a senha" />
                                    <div className="invalid-feedback">{this.state.errorPasswordMessage}</div>
                                </FormGroup>
                                <FormGroup label = "Confirmação de Senha: " htmlFor = "InputConfirmPassword">
                                    <input type="password"
                                    className={"form-control " + this.state.inputConfirmPasswordErrorClass + " "
                                                + this.state.signUpSuccessInputClass}
                                    value = {this.state.confirmPassword}
                                    onChange = {e => this.setState({confirmPassword: e.target.value})}
                                    onKeyPress={this.handleKeypress}
                                    id="InputConfirmPassword"
                                    placeholder="Repita a senha" />
                                    <div className="invalid-feedback">{this.state.errorConfirmPasswordMessage}</div>
                                </FormGroup>
                                <Button 
                                    label={this.state.signUpButtonMessage}
                                    icon="pi pi-check-circle"
                                    onClick={this.signUp}
                                    style={ {maxHeight: '35px'} }
                                    disabled={this.state.disableSignUpButton}
                                    />
                                <Button 
                                    label="Cancelar"
                                    className="p-button-danger"
                                    icon="pi pi-times"
                                    onClick={this.cancel}
                                    style={ {maxHeight: '35px', marginLeft: '8px'} }
                                    />
                            </fieldset>
                        </Card>
                    </div>
                 </div>
            // </div>
        )
    }
}

export default withRouter(SingUp)