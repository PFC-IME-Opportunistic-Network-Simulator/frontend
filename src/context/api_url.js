import React from 'react'

export const api_url_context = React.createContext({value: "localhost:8080/api"})

export default function api_url_Provider({children}) {
    return <api_url_context.Provider>{children}</api_url_context.Provider>;
}