import axios from 'axios'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import IndexPage from './pages/IndexPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}

export default App
