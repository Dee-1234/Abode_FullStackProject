import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';

function App() {
  const token = localStorage.getItem('authenticationToken');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      {/* 
        CRITICAL FIX: Changed h-screen to h-viewport bounds. 
        Using max-h-screen and items-stretch ensures that the 
        children containers fill the height completely without breaking.
      */}
      <div className={token ? "flex flex-row items-stretch w-full h-screen max-h-screen bg-zinc-950 text-zinc-100 m-0 p-0 overflow-hidden" : "min-h-screen bg-zinc-950 text-zinc-100"}>
        
        {/* LEFT COLUMN: Fixed Sidebar Slot */}
        {token && <Navbar onOpenNewRoom={() => setIsModalOpen(true)} />}
        
        {/* RIGHT COLUMN: Scrolling Feed Screen Canvas */}
        {/* 
          Added 'h-full' and 'w-full' to ensure the main route content container 
          does not collapse down to 0px height.
        */}
        <main className={token ? "flex-1 min-w-0 h-full w-full overflow-y-auto bg-zinc-950" : "w-full min-h-screen"}>
          <Routes>
            <Route
              path="/"
              element={token ? <Home isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/signup"
              element={!token ? <Signup /> : <Navigate to="/" replace />}
            />
            <Route
              path="/create-post"
              element={token ? <CreatePost /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;