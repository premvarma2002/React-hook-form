import { Routes, Route } from "react-router-dom";
import StudentForm from "./components/student.form";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentForm />} />
    </Routes>
  );
}

export default App;
