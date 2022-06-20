import { Route, Routes, Navigate } from "react-router-dom";
import TodoMain from "./components/Main/TodoMain";
import Signup from "./components/Signup/Signup.jsx";
import Login from "./components/Login/login.jsx";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<TodoMain />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	);
}

export default App;
