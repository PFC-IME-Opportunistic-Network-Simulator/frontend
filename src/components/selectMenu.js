import React from 'react'

class SelectMenu extends React.Component {
    render(){
        const options = this.props.list.map((option, index) => {
            return (
            <option key = {index} value={option.value}>{option.label}</option>
            )
        })
        
        return (
            <select {...this.props}>
                {options}
            </select>
        )
    }

}

export default SelectMenu