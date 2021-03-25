import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'
import { AuthContext } from '../main/authProvider'
import HandleErrorService from '../app/service/handleErrorService'
import JwtService from '../app/service/jwtService'
import { Button } from 'primereact/button'
import * as popUp from '../components/toastr'

class Login extends React.Component{
    
    constructor(){
        super();
        this.jwtService = new JwtService();
    }

    state = {
        email: '',
        password: '',
        errorEmailMessage: null,
        inputEmailErrorClass: null,
        errorPasswordMessage: null,
        inputPasswordErrorClass: null,
        loginButtonMessage: 'Entrar',
        disableLoginButton: false
    }

    resetView = () => {
        this.setState({errorEmailMessage: null})
        this.setState({inputEmailErrorClass: null})
        this.setState({errorPasswordMessage: null})
        this.setState({inputPasswordErrorClass: null})
    }

    login = () => {
        this.resetView()
        this.setState({loginButtonMessage: 'Entrando...'})
        this.setState({disableLoginButton: true})
        this.jwtService.auth(
        {
            email: this.state.email,
            passwd: this.state.password
        }).then(response => {
            const data = response.data
            var sessionInfo = data.sessionInfo
            this.context.beginSession(sessionInfo)
            this.props.history.push(`/home/${sessionInfo.user.name}/${sessionInfo.user.email}`)
            if(data.unparametrizedBuyProducts) popUp.noticeParametrizePopUp()
        }).catch(error => {
            if(error.response){
            var data = error.response.data
            if(data.toLowerCase().includes("email")){
            this.setState({errorEmailMessage: error.response.data})
            this.setState({inputEmailErrorClass: "is-invalid"})
            } else if(data.toLowerCase().includes("senha")){
                this.setState({errorPasswordMessage: error.response.data})
                this.setState({inputPasswordErrorClass: "is-invalid"})
            }
            HandleErrorService.handleError(this.props.history.push, error)
        }
            this.setState({loginButtonMessage: 'Entrar'})
            this.setState({disableLoginButton: false})
        })
    }

    handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.key === "Enter") {
        this.login();
      }
    }

    signUp = () => {
        this.props.history.push('/signUp')
    }

    render(){
        return(
                    <div className="bs-docs-section">
                        <div className = "col-md-4 d-flex "
                        style ={{margin: 'auto'}} >
                        <Card title = "Login">
                            <fieldset>
                                <FormGroup label = "Email: " htmlFor = "exampleInputEmail1">
                                    <input type="email"
                                    className={"form-control " + this.state.inputEmailErrorClass}
                                    value = {this.state.email}
                                    onChange = {e => this.setState({email: e.target.value})}
                                    onKeyPress={this.handleKeypress}
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Digite o Email" />
                                    <div className="invalid-feedback">{this.state.errorEmailMessage}</div>
                                </FormGroup>
                                <FormGroup label = "Senha: " htmlFor = "exampleInputPassword1">
                                    <input type="password"
                                    className={"form-control " + this.state.inputPasswordErrorClass}
                                    value = {this.state.password}
                                    onChange = {e => this.setState({password: e.target.value})}
                                    onKeyPress={this.handleKeypress}
                                    id="exampleInputPassword1"
                                    placeholder="Password" />
                                    <div className="invalid-feedback">{this.state.errorPasswordMessage}</div>
                                </FormGroup>
                                <Button 
                                    label={this.state.loginButtonMessage}
                                    icon="pi pi-sign-in"
                                    onClick={this.login}
                                    style={ {maxHeight: '35px'} }
                                    disabled={this.state.disableLoginButton}
                                    />
                                <Button 
                                    label="Cadastrar"
                                    className="p-button-danger"
                                    style={{marginLeft: '10px'}}
                                    icon="pi pi-save"
                                    onClick={this.signUp}
                                    style={ {maxHeight: '35px', marginLeft: '8px'} }
                                    />
                                 <Button label="Esqueceu a senha?"
                                        className="p-button-info p-button-text"
                                        onClick = {() => {this.props.history.push('/recoverPassword')}} />
                            </fieldset>
                        </Card>
                    </div>
                 </div>
            
            
        )
    }
    
}

Login.contextType = AuthContext

export default withRouter(Login)