import { Route, Routes } from "react-router"
import ProtectedRoutes from "./components/shared/ProtectedRoutes"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import User from "./pages/User"
import AdminPanel from "./pages/AdminPanel"
import AnimePage from "./pages/AnimePage"

function App() {
  return (
    <Routes>

      <Route element={<ProtectedRoutes allowedRoles={["null", "user", "admin"]} />} >
        <Route path="/" element={<Home />} />
        <Route path="/anime/:slug" element={<AnimePage />} />
      </Route>


      <Route element={<ProtectedRoutes allowedRoles={["null"]} />} >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>


      <Route element={<ProtectedRoutes allowedRoles={["user", "admin"]} />} >
        <Route path="/user" element={<User />} />
      </Route>


      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />} >
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Route>

    </Routes>
  )
}

export default App