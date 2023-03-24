import axios from 'axios'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import AccountPage from './pages/AccountPage.jsx'
import IndexPage from './pages/IndexPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { UserContextProvider } from './UserContext.jsx'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/account' element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
