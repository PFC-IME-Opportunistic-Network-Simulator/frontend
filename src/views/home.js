import React from 'react'
import UserService from '../app/service/userService';
import {HiUserGroup} from 'react-icons/hi'
import {MdAttachMoney} from 'react-icons/md'
import { AuthContext } from '../main/authProvider';
import { withRouter } from 'react-router-dom'
import FileService from '../app/service/fileService';
import FileUploadCard from '../components/fileUploadCard';


class Home extends React.Component {

    constructor(){
      super();
      this.userService = new UserService();
      this.fileService = new FileService();
      this.hiddenFileInput = React.createRef();
    }
    state = {
      balance: 0,
      name: '',
      email: '',
      file: null
    }

    componentDidMount(){
      this.userService.getBalance()
        .then(response => {
          this.setState({balance: response.data})
        }).catch(error => {
          console.error(error.response)
        })
        const params = this.props.match.params
        this.setState({name: params.name})
        this.setState({email: params.email})
    }
    render(){
        return (
          <div className = "row">
                <div className = "col-md-10" style = { {position : 'relative', left : '100px'} }>
                    <div className="bs-docs-section">
                      <div className="jumbotron">
                        { this.state.name && this.state.email ?
                        (
                          // <h1 >Bem vindo, {this.state.name}, {this.state.email}!</h1>
                          <h1 >Bem vindo, {this.state.name}, {this.context.userLoggedIn.email}!</h1>
                        ) : 
                        (
                          <h1 >Bem vindo!</h1>
                        )
                        }
                      <p >Esse é seu sistema de finanças.</p>
                      <p >Seu saldo para o mês atual é de R$ {this.state.balance}</p>
                      <hr className="my-4" />
                      <p>E essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
                      <p className="lead">
                        <a className="btn btn-primary"
                        href="#/signUp"
                        role="button"><HiUserGroup />  Cadastrar Usuário</a>
                        <a className="btn btn-danger right-button"
                        href="#/searchEntry"
                        role="button"><MdAttachMoney />  Cadastrar Lançamento</a>

                      <FileUploadCard />

                      </p>
                      </div>
                    </div>      
                </div>
            </div>    
        )
    }
}

Home.contextType = AuthContext

export default withRouter(Home)