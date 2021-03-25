import React from 'react';
import Routes from './routes'

import 'toastr/build/toastr.min.js'
import '../css/_variables.scss'
import '../css/_bootswatch.scss'
import '../css/bootstrap.min.css'
import '../css/bootstrap.css'
// import '../css/myBootswatch.css'
import '../css/custom.css'
import 'toastr/build/toastr.css'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import AuthenticationProvider from './authProvider'
import Topbar from '../components/topbar';

class App extends React.Component {

  render(){
    return(
      <div className = "body-color" >
      <AuthenticationProvider>
      <Topbar />
      {/* <div className = "container"> */}
        <Routes />
      {/* </div> */}
      </AuthenticationProvider>
      </div>
    );
  }
}

export default App;
