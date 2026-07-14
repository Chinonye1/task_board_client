import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div>
      <header>
        <Link to="/"><h2>Task Board</h2></Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App