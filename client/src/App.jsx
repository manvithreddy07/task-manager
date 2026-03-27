  import AuthPage from "./pages/AuthPage";
  import TasksPage from "./pages/TasksPage";
  import { AuthProvider, useAuth } from "./context/authContext";
  import Particles from "./components/Particles"; 

  function AppContent() {
    const { user, loading } = useAuth();
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">

        {/* Particles Background */}
        <Particles className="z-0" moveParticlesOnHover alphaParticles />

        {loading && (
          <div className="relative z-10 flex min-h-screen items-center justify-center">
            <div className="rounded-xl bg-white/20 backdrop-blur-md px-6 py-4 shadow-lg text-white">
              Loading...
            </div>
          </div>
        )}

        {!loading && !user && (
          <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 shadow-2xl text-white">
              <AuthPage />
            </div>
          </div>
        )}

        {!loading && user && (
          <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-10">
            <div className="w-full min-h-[70vh] max-w-5xl 
                            bg-white/10 backdrop-blur-lg 
                            border border-white/20 rounded-2xl p-6 overflow-y-auto">
              <TasksPage />
            </div>
          </div>
        )}

      </div>
    );
  }

  function App() {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  }

  export default App;