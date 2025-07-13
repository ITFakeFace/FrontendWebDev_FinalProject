import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {PrimeReactProvider} from 'primereact/api';
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import Tailwind from "primereact/passthrough/tailwind/index.js";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter basename="/FrontendWebDev_FinalProject">
            <PrimeReactProvider value={{pt: Tailwind}}>
                <App/>
            </PrimeReactProvider>
        </BrowserRouter>
    </StrictMode>,
)
