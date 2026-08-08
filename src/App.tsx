import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { BoardPage } from "./pages/BoardPage";
import { ActivityPage } from "./pages/ActivityPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/board/:projectId" element={<BoardPage />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
