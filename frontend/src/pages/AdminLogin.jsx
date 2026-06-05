import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAdmin } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      toast.success('Xush kelibsiz!');
      navigate('/admin/dashboard');
    } else {
      setError('Login yoki parol xato!');
      toast.error('Login yoki parol xato!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary to-primaryDark">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-primary rounded-2xl"><i className="text-3xl text-white fas fa-user-shield"></i></div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-500">Tizimga kirish</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Login" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-primary" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Parol" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-primary" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <button type="submit" className="w-full py-3 font-bold text-white transition bg-primary rounded-xl hover:bg-primary/90">Kirish</button>
        </form>
      </div>
    </div>
  );
}