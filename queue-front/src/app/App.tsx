import {useRoutes} from "react-router-dom";
import {router} from "./router/router/router.tsx";
import '../index.scss'

function App() {
  return (
    <>
        { useRoutes(router) }
    </>
  )
}

export default App
