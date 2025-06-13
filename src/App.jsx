import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/Layout'
import { routes } from '@/config/routes'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-dark">
        <Routes>
          <Route path="/" element={<Layout />}>
            {Object.values(routes).map((route) => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            <Route path="*" element={<div className="flex items-center justify-center h-full"><div className="text-white text-xl">Page not found</div></div>} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
          toastClassName="bg-surface border border-surface-light"
          progressClassName="bg-gradient-primary"
        />
      </div>
    </BrowserRouter>
  )
}

export default App