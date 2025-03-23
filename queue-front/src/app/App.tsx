import {useRoutes} from "react-router-dom";
import {router} from "./router/router/router.tsx";
import './App.scss'
import {AuthProvider} from "./context/AuthProvider/AuthProvider.tsx";

function App() {
  return (
    <>
        <AuthProvider>
          { useRoutes(router) }
        </AuthProvider>
    </>
  )
}

export default App
