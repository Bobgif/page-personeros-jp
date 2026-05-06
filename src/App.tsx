import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RegistroForm from './components/RegistroForm';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <RegistroForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
