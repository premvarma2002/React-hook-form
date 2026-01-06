import { Routes, Route } from "react-router-dom";
import StudentForm from "./components/student.form";
import Login from "./pages/login";

function App() {
  return (
    <Routes>
      <Route path="/students/create" element={<StudentForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<div>Dashboard</div>} />
    </Routes>
  );
}

export default App;
