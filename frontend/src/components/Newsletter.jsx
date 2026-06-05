import { useState } from 'react';
import api from '../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.post('/subscribe', { email });
      setSubmitted(true);
      setEmail('');
      setError('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primaryDark">
      <div className="container-max text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Yangiliklarga obuna bo'ling</h2>
        <p className="text-white/80 mb-6 max-w-md mx-auto">Eng so'nggi yangiliklardan birinchi bo'lib xabardor bo'ling</p>
        <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Email manzilingiz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button type="submit" className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
            <i className="fas fa-bell mr-2"></i> Obuna
          </button>
        </form>
        {submitted && <div className="mt-4 text-white animate-fadeInUp">✓ Siz muvaffaqiyatli obuna bo'ldingiz!</div>}
        {error && <div className="mt-4 text-red-200 animate-fadeInUp">{error}</div>}
      </div>
    </section>
  );
}