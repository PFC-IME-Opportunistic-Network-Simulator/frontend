import React from 'react'
class Card extends React.Component{

    render(){
        return(
            <div className = "card mb-3">
                {
                    this.props.title ?
                    <h3 className = "card-header"> {this.props.title} </h3>
                    : 
                    <div />
                    
                }
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bs-component">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Card