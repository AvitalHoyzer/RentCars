import React, { useState, useMemo, useEffect } from 'react';
import {
  Car as CarIcon,
  History,
  ChevronLeft,
  Star,
  Settings2,
  Briefcase,
  Users,
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  Lock,
  Search,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Globe,
  FileText,
  UtensilsCrossed,
  Activity,
  Trash2,
  Edit,
  Plus,
  ArrowRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Booking, Review, Tourist, Location, RentalCompany } from './types';

// --- Types ---
type Page = 'home' | 'inventory' | 'details' | 'checkout' | 'success' | 'history' | 'admin' | 'analytics' | 'login' | 'profile';
type Sector = 'cars' | 'restaurants';

interface DbCar {
  car_id: number;
  brand: string;
  model: string;
  year: number;
  car_type: string;
  seats_number: number;
  transmission_type: string;
  trunk_capacity: number;
  price_per_day: number;
  status: string;
  car_features: string;
  company_id: number;
  resolved_company?: string;
  resolved_city_id?: number;
}

interface DbRestaurant {
  rest_id: number;
  rest_name: string;
  address: string;
  cuisine_type: string;
  phone_number: string;
  average_price: number;
  city_id: number;
  resolved_city?: string;
}

interface DbCity {
  city_id: number;
  city_name: string;
  country_id: number;
  resolved_country?: string;
}

// Table schemas for Admin CRUD
const TABLE_SCHEMAS: Record<string, { label: string; pk: string; fields: { name: string; label: string; type: string; required?: boolean }[] }> = {
  tourist: {
    label: 'Tourists',
    pk: 'tourist_id',
    fields: [
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'language', label: 'Language', type: 'text', required: true },
      { name: 'password', label: 'Password', type: 'text', required: true },
      { name: 'birthday', label: 'Birthday (YYYY-MM-DD)', type: 'date', required: true },
      { name: 'user_name', label: 'Username', type: 'text', required: true },
      { name: 'passportnumber', label: 'Passport Number', type: 'text' }
    ]
  },
  car: {
    label: 'Cars',
    pk: 'car_id',
    fields: [
      { name: 'brand', label: 'Brand', type: 'text', required: true },
      { name: 'model', label: 'Model', type: 'text', required: true },
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'car_type', label: 'Car Type', type: 'text', required: true },
      { name: 'seats_number', label: 'Seats (2-9)', type: 'number', required: true },
      { name: 'transmission_type', label: 'Transmission (Auto, Manual)', type: 'text', required: true },
      { name: 'trunk_capacity', label: 'Trunk Capacity (L)', type: 'number' },
      { name: 'price_per_day', label: 'Price Per Day ($)', type: 'number', required: true },
      { name: 'status', label: 'Status (Available, Rented, Maintenance)', type: 'text', required: true },
      { name: 'car_features', label: 'Features (comma separated)', type: 'text' },
      { name: 'company_id', label: 'Company ID', type: 'number', required: true }
    ]
  },
  restaurant: {
    label: 'Restaurants',
    pk: 'rest_id',
    fields: [
      { name: 'rest_name', label: 'Name', type: 'text', required: true },
      { name: 'address', label: 'Address', type: 'text', required: true },
      { name: 'cuisine_type', label: 'Cuisine Type', type: 'text', required: true },
      { name: 'phone_number', label: 'Phone Number', type: 'text', required: true },
      { name: 'average_price', label: 'Average Price ($)', type: 'number', required: true },
      { name: 'city_id', label: 'City ID', type: 'number', required: true }
    ]
  },
  car_booking: {
    label: 'Car Bookings',
    pk: 'booking_id',
    fields: [
      { name: 'pickup_date', label: 'Pickup Date', type: 'date', required: true },
      { name: 'return_date', label: 'Return Date', type: 'date', required: true },
      { name: 'booking_date', label: 'Booking Date', type: 'date', required: true },
      { name: 'total_price', label: 'Total Price ($)', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'text', required: true },
      { name: 'car_id', label: 'Car ID', type: 'number', required: true },
      { name: 'tourist_id', label: 'Tourist ID', type: 'number', required: true },
      { name: 'pickup_city_id', label: 'Pickup City ID', type: 'number' },
      { name: 'return_city_id', label: 'Return City ID', type: 'number' }
    ]
  },
  rest_booking: {
    label: 'Restaurant Bookings',
    pk: 'booking_id',
    fields: [
      { name: 'booking_date', label: 'Booking Date', type: 'date', required: true },
      { name: 'num_of_people', label: 'Number of Guests', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'text', required: true },
      { name: 'tourist_id', label: 'Tourist ID', type: 'number', required: true },
      { name: 'rest_id', label: 'Restaurant ID', type: 'number', required: true }
    ]
  },
  rental_company: {
    label: 'Rental Companies',
    pk: 'company_id',
    fields: [
      { name: 'company_name', label: 'Company Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'city_id', label: 'City ID', type: 'number' }
    ]
  },
  city: {
    label: 'Cities',
    pk: 'city_id',
    fields: [
      { name: 'city_name', label: 'City Name', type: 'text', required: true },
      { name: 'country_id', label: 'Country ID', type: 'number', required: true }
    ]
  },
  country: {
    label: 'Countries',
    pk: 'country_id',
    fields: [
      { name: 'country_name', label: 'Country Name', type: 'text', required: true }
    ]
  },
  review: {
    label: 'Reviews',
    pk: 'review_id',
    fields: [
      { name: 'review_date', label: 'Review Date', type: 'date', required: true },
      { name: 'review_title', label: 'Review Title', type: 'text' },
      { name: 'comment', label: 'Comment', type: 'text' },
      { name: 'tourist_id', label: 'Tourist ID', type: 'number', required: true },
      { name: 'rest_id', label: 'Restaurant ID', type: 'number' },
      { name: 'car_id', label: 'Car ID', type: 'number' }
    ]
  },
  rating: {
    label: 'Ratings',
    pk: 'rate_num',
    fields: [
      { name: 'rating_type', label: 'Rating Type', type: 'text', required: true },
      { name: 'degree', label: 'Score (1-5)', type: 'number', required: true },
      { name: 'review_id', label: 'Review ID', type: 'number', required: true }
    ]
  },
  vip_tourist: {
    label: 'VIP Tourists',
    pk: 'tourist_id',
    fields: [
      { name: 'tourist_id', label: 'Tourist ID', type: 'number', required: true }
    ]
  }
};

// --- Components ---

const Navbar = ({
  user,
  onLogout,
  navigateTo,
  currentPage
}: {
  user: Tourist | null,
  onLogout: () => void,
  navigateTo: (p: Page) => void,
  currentPage: Page
}) => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-panel border-t-0 border-x-0 rounded-none bg-[#2a2a2a]/90 backdrop-blur-lg">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
      <CarIcon className="text-gold w-8 h-8" />
      <span className="text-2xl font-serif font-bold tracking-tighter gold-text">DRIVE & DINE</span>
    </div>

    <div className="hidden md:flex items-center gap-6">
      <button
        onClick={() => navigateTo('home')}
        className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-gold ${currentPage === 'home' ? 'text-gold' : 'text-white/70'}`}
      >
        Home
      </button>
      <button
        onClick={() => navigateTo('inventory')}
        className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-gold ${currentPage === 'inventory' ? 'text-gold' : 'text-white/70'}`}
      >
        Catalog
      </button>
      <button
        onClick={() => navigateTo('history')}
        className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-gold ${currentPage === 'history' ? 'text-gold' : 'text-white/70'}`}
      >
        History
      </button>
      <button
        onClick={() => navigateTo('admin')}
        className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-gold ${currentPage === 'admin' ? 'text-gold' : 'text-white/70'}`}
      >
        Admin CRUD
      </button>
      <button
        onClick={() => navigateTo('analytics')}
        className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-gold ${currentPage === 'analytics' ? 'text-gold' : 'text-white/70'}`}
      >
        Business Insights
      </button>
    </div>

    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:border-gold cursor-pointer transition-all group"
            title="Edit Profile"
          >
            <User className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">{user.firstName}</span>
          </div>
          <button
            onClick={onLogout}
            className="gold-btn py-2 px-6 text-sm"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigateTo('login')}
          className="gold-btn py-2 px-6 text-sm"
        >
          Sign In
        </button>
      )}
    </div>
  </nav>
);

const AuthGate = ({ onLogin, onCancel }: { onLogin: (user: Tourist) => void; onCancel?: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    passportNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Israel',
    password: '',
    userName: '',
    language: 'English',
    birthday: '2000-01-01'
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      try {
        const res = await fetch('/api/tables/tourist');
        if (res.ok) {
          const list: any[] = await res.json();
          const found = list.find(t => t.email.toLowerCase() === formData.email.toLowerCase());
          if (found) {
            onLogin({
              passportNumber: found.passportnumber || 'P99999',
              firstName: found.first_name,
              lastName: found.last_name,
              email: found.email,
              phone: found.phone,
              country: 'Israel',
              tourist_id: found.tourist_id
            } as any);
          } else {
            setErrorMsg('User not found. Try first_name_car@mail.com from the database, or register.');
          }
        }
      } catch (err) {
        setErrorMsg('Error connecting to database.');
      }
    } else {
      try {
        const res = await fetch('/api/tables/tourist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            language: formData.language,
            password: formData.password,
            birthday: formData.birthday,
            user_name: formData.userName,
            passportnumber: formData.passportNumber
          })
        });

        if (res.ok) {
          const registeredUser = await res.json();
          onLogin({
            passportNumber: registeredUser.passportnumber,
            firstName: registeredUser.first_name,
            lastName: registeredUser.last_name,
            email: registeredUser.email,
            phone: registeredUser.phone,
            country: 'Global',
            tourist_id: registeredUser.tourist_id
          } as any);
        } else {
          const err = await res.json();
          setErrorMsg(err.error || 'Registration failed.');
        }
      } catch (err) {
        setErrorMsg('Failed to reach backend.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-hero flex items-center justify-center p-6 relative overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-10 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold gold-text">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-white/50 text-sm mt-2">{isLogin ? 'Sign in to your premium account' : 'Join our elite Drive & Dine community'}</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Passport Number</label>
                <input
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
                  placeholder="P1234567"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
              placeholder="john@example.com"
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Username</label>
                  <input
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
                    placeholder="johndoe123"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Preferred Language</label>
                  <input
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                    className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
                    placeholder="English"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Birthday</label>
                <input
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  type="date"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
              className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="gold-btn w-full py-4 mt-4 uppercase tracking-widest">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 mt-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-center"
          >
            Cancel / Back to Home
          </button>
        )}

        <p className="text-center mt-8 text-sm text-white/50">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-gold font-bold hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const BookingDetailModal = ({ booking, onClose }: { booking: any, onClose: () => void }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel p-8 md:p-10 w-full max-w-2xl relative z-10 overflow-y-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gold/20 border border-gold/30">
              <FileText className="text-gold w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-gold uppercase tracking-[0.3em]">Booking Details</p>
              <h2 className="text-3xl font-serif font-bold">Order #{booking.booking_id}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Booking Type</p>
                <p className="text-xl font-serif font-bold">{booking.resolved_car ? 'Car Rental' : 'Restaurant Reservation'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</p>
                <div className="inline-flex px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                  {booking.status}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Booking Date</p>
                <p className="text-sm font-bold">{new Date(booking.booking_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Summary Name</p>
                <p className="text-lg font-bold">{booking.resolved_car || booking.resolved_restaurant}</p>
              </div>
              {booking.pickup_date && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Price</p>
                  <p className="text-2xl font-bold text-gold">${booking.total_price}</p>
                </div>
              )}
            </div>
          </div>

          <button onClick={onClose} className="gold-btn w-full py-4 uppercase tracking-widest mt-4">
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProfilePage = ({
  user,
  onUpdateUser,
  navigateTo
}: {
  user: any,
  onUpdateUser: (u: any) => void,
  navigateTo: (p: Page) => void
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    language: 'English',
    password: '',
    birthday: '',
    user_name: '',
    passportnumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/tables/tourist/${user.tourist_id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.birthday) {
            data.birthday = data.birthday.split('T')[0];
          }
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            language: data.language || 'English',
            password: data.password || '',
            birthday: data.birthday || '',
            user_name: data.user_name || '',
            passportnumber: data.passportnumber || ''
          });
        } else {
          setErrorMsg('Failed to load profile from database.');
        }
      } catch (err) {
        setErrorMsg('Network error while loading profile.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.tourist_id) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/tables/tourist/${user.tourist_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccessMsg('Profile updated successfully!');
        onUpdateUser({
          ...user,
          firstName: formData.first_name,
          lastName: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          passportNumber: formData.passportnumber
        });
        setTimeout(() => {
          navigateTo('home');
        }, 1500);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg('Failed to reach backend.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 text-center py-20">
        <p className="text-white/60 italic">Loading your profile details...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto px-6 glass-panel p-8 rounded-3xl border border-white/10"
    >
      <button onClick={() => navigateTo('home')} className="text-white/50 hover:text-gold flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-6">
        <ChevronLeft size={16} /> Back to Home
      </button>

      <h3 className="text-3xl font-serif font-bold text-gold mb-6 uppercase tracking-wide">Edit Profile</h3>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold mb-4 text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 text-center">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">First Name</label>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Last Name</label>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
            className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="text"
            required
            className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Preferred Language</label>
            <input
              name="language"
              value={formData.language}
              onChange={handleChange}
              type="text"
              required
              className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Passport Number</label>
            <input
              name="passportnumber"
              value={formData.passportnumber}
              onChange={handleChange}
              type="text"
              required
              className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Username</label>
            <input
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              type="text"
              required
              className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Birthday</label>
            <input
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              type="date"
              required
              className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
            className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold text-sm"
          />
        </div>

        <button type="submit" className="gold-btn w-full py-3 mt-4 uppercase tracking-widest text-sm">
          Save Profile Changes
        </button>
      </form>
    </motion.div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [sector, setSector] = useState<Sector>('cars');

  // Persisted user session in localStorage
  const [user, setUser] = useState<Tourist | null>(() => {
    const saved = localStorage.getItem('rentcars_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Database lists
  const [cities, setCities] = useState<DbCity[]>([]);
  const [companies, setCompanies] = useState<RentalCompany[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [restaurants, setRestaurants] = useState<DbRestaurant[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Selection states
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedRest, setSelectedRest] = useState<DbRestaurant | null>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [viewingBooking, setViewingBooking] = useState<any>(null);
  const [visibleCarsCount, setVisibleCarsCount] = useState(24);
  const [visibleRestsCount, setVisibleRestsCount] = useState(24);

  // Review / Feedback form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  // Search parameters
  const [searchParams, setSearchParams] = useState({
    pickupLocationId: '',
    returnLocationId: '',
    pickupDate: '',
    returnDate: '',
    carType: 'All',
    seatsNumber: 'All'
  });

  const [restSearchParams, setRestSearchParams] = useState({
    cityId: '',
    cuisineType: 'All',
    peopleNum: '2',
    bookingDate: ''
  });

  // Admin CRUD state
  const [selectedTable, setSelectedTable] = useState<string>('car');
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [crudSearchId, setCrudSearchId] = useState<string>('');
  const [crudFormData, setCrudFormData] = useState<Record<string, any>>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [crudError, setCrudError] = useState<string | null>(null);
  const [crudSuccess, setCrudSuccess] = useState<string | null>(null);
  const [crudLimit, setCrudLimit] = useState<string>('100');

  // Analytics states
  const [jcarsResult, setJcarsResult] = useState<any[]>([]);
  const [recommendedResult, setRecommendedResult] = useState<any[]>([]);
  const [subprogramLogs, setSubprogramLogs] = useState<string[]>([]);
  const [healthIndexCity, setHealthIndexCity] = useState<string>('Jerusalem');
  const [healthIndexScore, setHealthIndexScore] = useState<number | null>(null);
  const [activityTouristId, setActivityTouristId] = useState<string>('1');
  const [activityRows, setActivityRows] = useState<any[]>([]);

  const [pkgFormData, setPkgFormData] = useState({
    touristId: '1',
    carId: '1',
    pickupCityId: '1',
    returnCityId: '1',
    pickupDate: '2026-07-01',
    returnDate: '2026-07-05',
    restId: '1',
    restBookingDate: '2026-07-01',
    numOfPeople: '2'
  });
  const [showPkgForm, setShowPkgForm] = useState(false);

  // Fetch lists concurrently via Promise.all
  const fetchInitialDbData = async () => {
    try {
      const [citiesRes, companiesRes, carsRes, restRes, touristsRes, reviewsRes] = await Promise.all([
        fetch('/api/tables/city?limit=all'),
        fetch('/api/tables/rental_company?resolve=true&limit=all'),
        fetch('/api/tables/car?resolve=true&limit=all'),
        fetch('/api/tables/restaurant?resolve=true&limit=all'),
        fetch('/api/tables/tourist?limit=all'),
        fetch('/api/tables/review?resolve=true&limit=all')
      ]);

      if (citiesRes.ok) {
        const cData: DbCity[] = await citiesRes.json();
        setCities(cData);
        if (cData.length > 0) {
          setSearchParams(prev => ({
            ...prev,
            pickupLocationId: '', // Default to empty string (All Cities)
            returnLocationId: ''  // Default to empty string (All Cities)
          }));
          setRestSearchParams(prev => ({
            ...prev,
            cityId: '' // All Cities by default in catalog
          }));
        }
      }

      if (companiesRes.ok) {
        const compData = await companiesRes.json();
        setCompanies(compData.map((c: any) => ({
          id: String(c.company_id),
          name: c.company_name,
          country: c.resolved_city || 'Israel'
        })));
      }

      if (carsRes.ok) {
        const carsData: DbCar[] = await carsRes.json();
        setCars(carsData.map(c => ({
          car_id: String(c.car_id),
          brand: c.brand,
          model: c.model,
          year: c.year,
          car_type: c.car_type as any,
          seats_number: c.seats_number,
          transmission_type: c.transmission_type as any,
          trunk_capacity: c.trunk_capacity ? `${c.trunk_capacity}L` : '400L',
          price_per_day: Number(c.price_per_day),
          car_features: c.car_features ? c.car_features.split(', ') : ['Bluetooth', 'Premium Sound'],
          status: c.status as any,
          image: c.car_type === 'SUV'
            ? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
            : c.car_type === 'Sports'
              ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
              : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
          company_id: c.company_id,
          city_id: c.resolved_city_id
        })));
      }

      if (restRes.ok) {
        setRestaurants(await restRes.json());
      }

      if (reviewsRes.ok) {
        setReviews(await reviewsRes.json());
      }

      if (touristsRes.ok) {
        const tList = await touristsRes.json();
        const saved = localStorage.getItem('rentcars_user');
        const explicitLogout = localStorage.getItem('rentcars_explicit_logout');
        if (tList.length > 0 && !saved && !explicitLogout) {
          const firstT = tList[0];
          const defaultUser = {
            passportNumber: firstT.passportnumber || 'P123456',
            firstName: firstT.first_name,
            lastName: firstT.last_name,
            email: firstT.email,
            phone: firstT.phone,
            country: 'Israel',
            tourist_id: firstT.tourist_id
          };
          setUser(defaultUser);
          localStorage.setItem('rentcars_user', JSON.stringify(defaultUser));
        }
      }
    } catch (err) {
      console.error('Failed to load database details', err);
    }
  };

  useEffect(() => {
    fetchInitialDbData();
  }, []);

  useEffect(() => {
    setVisibleCarsCount(24);
  }, [searchParams]);

  useEffect(() => {
    setVisibleRestsCount(24);
  }, [restSearchParams]);

  const fetchUserBookings = async () => {
    if (!user) return;
    try {
      const dbUser: any = user;
      const tId = dbUser.tourist_id;
      const list: any[] = [];

      const [carsBookRes, restBookRes] = await Promise.all([
        fetch(`/api/tables/car_booking?resolve=true&tourist_id=${tId}`),
        fetch(`/api/tables/rest_booking?resolve=true&tourist_id=${tId}`)
      ]);

      if (carsBookRes.ok) {
        const data: any[] = await carsBookRes.json();
        list.push(...data);
      }

      if (restBookRes.ok) {
        const data: any[] = await restBookRes.json();
        list.push(...data);
      }

      setUserBookings(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user, page]);

  const handleLogin = (profile: Tourist) => {
    setUser(profile);
    localStorage.setItem('rentcars_user', JSON.stringify(profile));
    localStorage.removeItem('rentcars_explicit_logout');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rentcars_user');
    localStorage.setItem('rentcars_explicit_logout', 'true');
    setPage('home');
  };

  const navigateTo = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    navigateTo('checkout');
  };

  const confirmCarBooking = async () => {
    if (!selectedCar || !user) return;
    const dbUser: any = user;

    try {
      const res = await fetch('/api/tables/car_booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_date: searchParams.pickupDate || new Date().toISOString().split('T')[0],
          return_date: searchParams.returnDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
          booking_date: new Date().toISOString().split('T')[0],
          total_price: selectedCar.price_per_day * 4,
          status: 'Booked',
          car_id: Number(selectedCar.car_id),
          tourist_id: dbUser.tourist_id,
          pickup_city_id: Number(searchParams.pickupLocationId) || 1,
          return_city_id: Number(searchParams.returnLocationId) || 1
        })
      });

      if (res.ok) {
        navigateTo('success');
        fetchInitialDbData(); // refresh cars
      } else {
        const err = await res.json();
        alert(`Booking failed: ${err.error}`);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const confirmRestBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRest || !user) return;
    const dbUser: any = user;

    try {
      const res = await fetch('/api/tables/rest_booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_date: restSearchParams.bookingDate || new Date().toISOString().split('T')[0],
          num_of_people: Number(restSearchParams.peopleNum),
          status: 'Confirmed',
          tourist_id: dbUser.tourist_id,
          rest_id: selectedRest.rest_id
        })
      });

      if (res.ok) {
        navigateTo('success');
      } else {
        const err = await res.json();
        alert(`Booking failed: ${err.error}. Diner capacity limit (e.g. max 20) might be violated.`);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent, type: 'car' | 'restaurant') => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    if (!user) {
      setReviewError('You must be signed in to submit reviews.');
      return;
    }

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      setReviewError('Please provide a title and comment.');
      return;
    }

    const dbUser: any = user;

    try {
      // 1. Submit review
      const reviewBody = {
        review_date: new Date().toISOString().split('T')[0],
        review_title: reviewTitle,
        comment: reviewComment,
        tourist_id: dbUser.tourist_id,
        car_id: type === 'car' && selectedCar ? Number(selectedCar.car_id) : null,
        rest_id: type === 'restaurant' && selectedRest ? Number(selectedRest.rest_id) : null
      };

      const revRes = await fetch('/api/tables/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewBody)
      });

      if (!revRes.ok) {
        const err = await revRes.json();
        throw new Error(err.error || 'Failed to submit review record.');
      }

      const createdReview = await revRes.json();
      const reviewId = createdReview.review_id;

      // 2. Submit rating
      const ratingBody = {
        rating_type: type === 'car' ? 'Car Rental' : 'Restaurant',
        degree: Number(reviewRating),
        review_id: Number(reviewId)
      };

      const ratRes = await fetch('/api/tables/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingBody)
      });

      if (!ratRes.ok) {
        const err = await ratRes.json();
        throw new Error(err.error || 'Failed to submit rating record.');
      }

      setReviewSuccess('Review and rating successfully submitted!');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);

      // Refresh reviews list
      const freshReviewsRes = await fetch('/api/tables/review?resolve=true&limit=all');
      if (freshReviewsRes.ok) {
        setReviews(await freshReviewsRes.json());
      }

    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
    }
  };

  // Filter lists based on search selections
  const filteredCars = useMemo(() => {
    let result = [...cars];
    if (searchParams.pickupLocationId) {
      result = result.filter(c => c.city_id === Number(searchParams.pickupLocationId));
    }
    if (searchParams.carType !== 'All') {
      result = result.filter(c => c.car_type === searchParams.carType);
    }
    if (searchParams.seatsNumber !== 'All') {
      result = result.filter(c => c.seats_number >= parseInt(searchParams.seatsNumber));
    }
    return result;
  }, [cars, searchParams]);

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];
    if (restSearchParams.cityId) {
      result = result.filter(r => r.city_id === Number(restSearchParams.cityId));
    }
    if (restSearchParams.cuisineType !== 'All') {
      result = result.filter(r => r.cuisine_type === restSearchParams.cuisineType);
    }
    return result;
  }, [restaurants, restSearchParams]);

  // Admin CRUD operations
  const fetchAdminTable = async (tableName: string, limitVal: string = crudLimit) => {
    setCrudError(null);
    setCrudSuccess(null);
    try {
      const res = await fetch(`/api/tables/${tableName}?resolve=true&limit=${limitVal}&sort=desc`);
      if (res.ok) {
        const data = await res.json();
        setTableRows(data);
      } else {
        const errData = await res.json();
        setCrudError(errData.error || 'Failed to fetch table records');
      }
    } catch (err: any) {
      setCrudError(err.message);
    }
  };

  useEffect(() => {
    if (page === 'admin') {
      fetchAdminTable(selectedTable, crudLimit);
      setCrudFormData({});
      setIsEditMode(false);
      setCrudSearchId('');
    }
  }, [selectedTable, page, crudLimit]);

  const handleCrudFetch = async () => {
    if (!crudSearchId.trim()) {
      setCrudError('Enter a valid key/ID');
      return;
    }
    setCrudError(null);
    setCrudSuccess(null);
    try {
      const res = await fetch(`/api/tables/${selectedTable}/${crudSearchId}`);
      if (res.ok) {
        const data = await res.json();
        setCrudFormData(data);
        setIsEditMode(true);
        setCrudSuccess(`Fetched ID ${crudSearchId} successfully.`);
      } else {
        const errData = await res.json();
        setCrudError(errData.error || 'Record not found.');
        setIsEditMode(false);
      }
    } catch (err: any) {
      setCrudError(err.message);
    }
  };

  const handleCrudSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrudError(null);
    setCrudSuccess(null);

    const pk = TABLE_SCHEMAS[selectedTable].pk;
    const url = isEditMode
      ? `/api/tables/${selectedTable}/${crudFormData[pk]}`
      : `/api/tables/${selectedTable}`;
    const method = isEditMode ? 'PUT' : 'POST';

    // Parse numbers
    const dataToSend = { ...crudFormData };
    TABLE_SCHEMAS[selectedTable].fields.forEach(f => {
      if (f.type === 'number' && dataToSend[f.name] !== undefined) {
        dataToSend[f.name] = Number(dataToSend[f.name]);
      }
    });

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (res.ok) {
        setCrudSuccess(isEditMode ? 'Updated successfully!' : 'Created successfully!');
        setCrudFormData({});
        setIsEditMode(false);
        setCrudSearchId('');
        fetchAdminTable(selectedTable);
        fetchInitialDbData();
      } else {
        const errData = await res.json();
        setCrudError(errData.error || 'Operation failed.');
      }
    } catch (err: any) {
      setCrudError(err.message);
    }
  };

  const handleCrudDelete = async (id: any) => {
    if (!window.confirm(`Delete record ID ${id}?`)) return;
    setCrudError(null);
    setCrudSuccess(null);
    try {
      const res = await fetch(`/api/tables/${selectedTable}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCrudSuccess(`Deleted record ID ${id}.`);
        fetchAdminTable(selectedTable);
        fetchInitialDbData();
      } else {
        const err = await res.json();
        setCrudError(err.error || 'Failed to delete record due to constraint protections.');
      }
    } catch (err: any) {
      setCrudError(err.message);
    }
  };

  const renderCell = (colName: string, row: any) => {
    if (colName === 'company_id' && row.resolved_company) return row.resolved_company;
    if (colName === 'car_id' && row.resolved_car) return row.resolved_car;
    if (colName === 'tourist_id' && row.resolved_tourist) return row.resolved_tourist;
    if (colName === 'pickup_city_id' && row.resolved_pickup_city) return row.resolved_pickup_city;
    if (colName === 'return_city_id' && row.resolved_return_city) return row.resolved_return_city;
    if (colName === 'rest_id' && row.resolved_restaurant) return row.resolved_restaurant;
    if (colName === 'city_id' && row.resolved_city) return row.resolved_city;
    if (colName === 'country_id' && row.resolved_country) return row.resolved_country;
    if (colName === 'review_id' && row.resolved_review) return row.resolved_review;

    const val = row[colName];
    if (val === null || val === undefined) return '-';
    return String(val);
  };

  // Analytics triggers
  const runJerusalemCarsQuery = async () => {
    try {
      const res = await fetch('/api/queries/jerusalem-cars');
      if (res.ok) setJcarsResult(await res.json());
    } catch (err) { console.error(err); }
  };

  const runRecommendedQuery = async () => {
    try {
      const res = await fetch('/api/queries/recommended-cars');
      if (res.ok) setRecommendedResult(await res.json());
    } catch (err) { console.error(err); }
  };

  const runDiscountProcedure = async () => {
    setSubprogramLogs(['Calling procedure public.pr_apply_strategic_discounts()...']);
    try {
      const res = await fetch('/api/procedures/apply-discounts', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSubprogramLogs(prev => [...prev, ...data.logs, 'Procedure executed successfully.']);
        fetchInitialDbData();
      } else {
        setSubprogramLogs(prev => [...prev, ...data.logs, `Error: ${data.error}`]);
      }
    } catch (err: any) {
      setSubprogramLogs(prev => [...prev, `Network error: ${err.message}`]);
    }
  };

  const runBookPackageProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubprogramLogs(['Calling procedure public.pr_book_integrated_package()...']);
    try {
      const res = await fetch('/api/procedures/book-integrated-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourist_id: Number(pkgFormData.touristId),
          car_id: Number(pkgFormData.carId),
          pickup_city_id: Number(pkgFormData.pickupCityId),
          return_city_id: Number(pkgFormData.returnCityId),
          pickup_date: pkgFormData.pickupDate,
          return_date: pkgFormData.returnDate,
          rest_id: Number(pkgFormData.restId),
          rest_booking_date: pkgFormData.restBookingDate,
          num_of_people: Number(pkgFormData.numOfPeople)
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubprogramLogs(prev => [...prev, ...data.logs, 'Integrated Package booked successfully.']);
        fetchInitialDbData();
      } else {
        setSubprogramLogs(prev => [...prev, ...data.logs, `Error: ${data.error}`]);
      }
    } catch (err: any) {
      setSubprogramLogs(prev => [...prev, `Network error: ${err.message}`]);
    }
  };

  const runCityHealthIndex = async () => {
    setSubprogramLogs([`Calling function public.fn_calculate_city_health_index('${healthIndexCity}')...`]);
    setHealthIndexScore(null);
    try {
      const res = await fetch(`/api/functions/city-health-index?city=${encodeURIComponent(healthIndexCity)}`);
      const data = await res.json();
      if (data.success) {
        setSubprogramLogs(prev => [...prev, ...data.logs]);
        setHealthIndexScore(data.healthIndex);
      } else {
        setSubprogramLogs(prev => [...prev, ...data.logs, `Error: ${data.error}`]);
      }
    } catch (err: any) {
      setSubprogramLogs(prev => [...prev, `Network error: ${err.message}`]);
    }
  };

  const runTouristActivity = async () => {
    setSubprogramLogs([`Calling function public.fn_get_tourist_activity(${activityTouristId}) (Cursor)...`]);
    setActivityRows([]);
    try {
      const res = await fetch(`/api/functions/tourist-activity/${activityTouristId}`);
      const data = await res.json();
      if (data.success) {
        setSubprogramLogs(prev => [...prev, ...data.logs]);
        setActivityRows(data.rows);
      } else {
        setSubprogramLogs(prev => [...prev, ...data.logs, `Error: ${data.error}`]);
      }
    } catch (err: any) {
      setSubprogramLogs(prev => [...prev, `Network error: ${err.message}`]);
    }
  };

  // Setup dynamic background style based on active sector
  const heroStyle = {
    backgroundImage: sector === 'cars'
      ? `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920')`
      : `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920')`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto" style={heroStyle}>
      <Navbar user={user} onLogout={handleLogout} navigateTo={navigateTo} currentPage={page} />

      <main className="flex-grow relative z-10 pt-24">
        <AnimatePresence mode="wait">

          {/* ==================== HOME PAGE ==================== */}
          {page === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center pt-12 px-6 pb-20"
            >
              <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-center mb-20">
                <div className="space-y-6">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4c3f16] border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-[0.3em]"
                  >
                    <Star className="w-3 h-3 fill-gold" /> Integrated Ecosystem
                  </motion.div>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-6xl md:text-8xl font-serif font-bold leading-none tracking-tighter"
                  >
                    ELEVATE YOUR <br />
                    <span className="gold-text italic">JOURNEY</span>
                  </motion.h1>
                  <p className="text-lg text-white/70 max-w-lg leading-relaxed">
                    Welcome to the premium tourist mobility & dining portal. Browse luxurious rental vehicles and secure reservation tables at gourmet locations.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => navigateTo('inventory')} className="gold-btn flex items-center gap-2">
                      View Catalog <ChevronRight size={18} />
                    </button>
                    <button onClick={() => navigateTo('analytics')} className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs flex items-center">
                      View Business Insights
                    </button>
                  </div>
                </div>

                {/* Combined Search Panel */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass-panel p-8 md:p-10 space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h3 className="text-2xl font-serif font-bold text-gold">
                      {sector === 'cars' ? 'Search Luxury Vehicles' : 'Search Fine Dining'}
                    </h3>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => setSector('cars')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${sector === 'cars' ? 'bg-gold text-black' : 'text-white/60 hover:text-white'}`}
                      >
                        Cars
                      </button>
                      <button
                        onClick={() => setSector('restaurants')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${sector === 'restaurants' ? 'bg-gold text-black' : 'text-white/60 hover:text-white'}`}
                      >
                        Restaurants
                      </button>
                    </div>
                  </div>

                  {sector === 'cars' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Pickup City</label>
                        <select
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={searchParams.pickupLocationId}
                          onChange={(e) => setSearchParams({ ...searchParams, pickupLocationId: e.target.value })}
                        >
                          <option value="">All Cities</option>
                          {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Return City</label>
                        <select
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={searchParams.returnLocationId}
                          onChange={(e) => setSearchParams({ ...searchParams, returnLocationId: e.target.value })}
                        >
                          <option value="">All Cities</option>
                          {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Pickup Date</label>
                        <input
                          type="date"
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={searchParams.pickupDate}
                          onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Return Date</label>
                        <input
                          type="date"
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={searchParams.returnDate}
                          onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Dining City</label>
                        <select
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={restSearchParams.cityId}
                          onChange={(e) => setRestSearchParams({ ...restSearchParams, cityId: e.target.value })}
                        >
                          {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Cuisine Type</label>
                        <select
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={restSearchParams.cuisineType}
                          onChange={(e) => setRestSearchParams({ ...restSearchParams, cuisineType: e.target.value })}
                        >
                          <option value="All">All Cuisines</option>
                          <option value="Italian">Italian</option>
                          <option value="French">French</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Steakhouse">Steakhouse</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Diners Count</label>
                        <input
                          type="number"
                          min="1"
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={restSearchParams.peopleNum}
                          onChange={(e) => setRestSearchParams({ ...restSearchParams, peopleNum: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gold uppercase tracking-widest ml-1">Reservation Date</label>
                        <input
                          type="date"
                          className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                          value={restSearchParams.bookingDate}
                          onChange={(e) => setRestSearchParams({ ...restSearchParams, bookingDate: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigateTo('inventory')}
                    className="gold-btn w-full py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                  >
                    <Search size={18} /> Search Catalog
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ==================== CATALOG PAGE ==================== */}
          {page === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-8 py-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-2">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit mb-2">
                    <button
                      onClick={() => setSector('cars')}
                      className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${sector === 'cars' ? 'bg-gold text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      Premium Cars
                    </button>
                    <button
                      onClick={() => setSector('restaurants')}
                      className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${sector === 'restaurants' ? 'bg-gold text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      Fine Restaurants
                    </button>
                  </div>
                  <h2 className="text-5xl font-serif font-bold gold-text italic uppercase">
                    Our {sector === 'cars' ? 'Luxury Fleet' : 'Dining Spots'}
                  </h2>
                </div>

                {/* Catalog Filter Bars */}
                {sector === 'cars' ? (
                  <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">City</span>
                      <select
                        value={searchParams.pickupLocationId}
                        onChange={(e) => setSearchParams({ ...searchParams, pickupLocationId: e.target.value })}
                        className="glass-input px-4 py-2 rounded-xl text-black font-bold text-xs min-w-[130px]"
                      >
                        <option value="">All Cities</option>
                        {cities.map(c => (
                          <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Car Type</span>
                      <select
                        value={searchParams.carType}
                        onChange={(e) => setSearchParams({ ...searchParams, carType: e.target.value })}
                        className="glass-input px-4 py-2 rounded-xl text-black font-bold text-xs min-w-[130px]"
                      >
                        <option value="All">All Types</option>
                        <option value="SUV">SUV</option>
                        <option value="Sports">Sports</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Mini">Mini</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Min Seats</span>
                      <select
                        value={searchParams.seatsNumber}
                        onChange={(e) => setSearchParams({ ...searchParams, seatsNumber: e.target.value })}
                        className="glass-input px-4 py-2 rounded-xl text-black font-bold text-xs min-w-[110px]"
                      >
                        <option value="All">Any Seats</option>
                        <option value="2">2+ Seats</option>
                        <option value="4">4+ Seats</option>
                        <option value="5">5+ Seats</option>
                        <option value="7">7+ Seats</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Cuisine Type</span>
                      <select
                        value={restSearchParams.cuisineType}
                        onChange={(e) => setRestSearchParams({ ...restSearchParams, cuisineType: e.target.value })}
                        className="glass-input px-4 py-2 rounded-xl text-black font-bold text-xs min-w-[130px]"
                      >
                        <option value="All">All Cuisines</option>
                        <option value="Italian">Italian</option>
                        <option value="French">French</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Steakhouse">Steakhouse</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">City</span>
                      <select
                        value={restSearchParams.cityId}
                        onChange={(e) => setRestSearchParams({ ...restSearchParams, cityId: e.target.value })}
                        className="glass-input px-4 py-2 rounded-xl text-black font-bold text-xs min-w-[130px]"
                      >
                        <option value="">All Cities</option>
                        {cities.map(c => (
                          <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {sector === 'cars' ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars.slice(0, visibleCarsCount).map(car => (
                      <div
                        key={car.car_id}
                        className="glass-panel group cursor-pointer overflow-hidden rounded-3xl flex flex-col justify-between h-[450px]"
                        onClick={() => { setSelectedCar(car); navigateTo('details'); }}
                      >
                        <div className="relative h-56 bg-neutral-900 flex items-center justify-center overflow-hidden">
                          {car.image ? (
                            <img
                              src={car.image}
                              alt={`${car.brand} ${car.model}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <CarIcon size={64} className="text-gold/20" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 rounded-lg text-xs font-bold text-gold border border-gold/30">
                            ${car.price_per_day}/day
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">{car.brand}</p>
                            <h3 className="text-xl font-serif font-bold mb-3">{car.model}</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
                              <span className="flex items-center gap-1"><Users size={12} /> {car.seats_number} Seats</span>
                              <span className="flex items-center gap-1"><Settings2 size={12} /> {car.transmission_type}</span>
                              <span>Type: {car.car_type}</span>
                              <span>Year: {car.year}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBookNow(car); }}
                            className="w-full py-3 mt-4 rounded-xl border border-gold/30 text-gold font-bold text-xs uppercase hover:bg-gold hover:text-black transition-all"
                          >
                            Reserve Vehicle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredCars.length > visibleCarsCount && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setVisibleCarsCount(prev => prev + 24)}
                        className="gold-btn py-3 px-8 uppercase tracking-widest text-xs"
                      >
                        Show More Cars ({filteredCars.length - visibleCarsCount} remaining)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRestaurants.slice(0, visibleRestsCount).map(rest => (
                      <div
                        key={rest.rest_id}
                        className="glass-panel group cursor-pointer overflow-hidden rounded-3xl flex flex-col justify-between h-[450px]"
                        onClick={() => { setSelectedRest(rest); navigateTo('details'); }}
                      >
                        <div className="relative h-56 bg-neutral-900 flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              rest.cuisine_type?.toLowerCase().includes('italian')
                                ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
                                : rest.cuisine_type?.toLowerCase().includes('french')
                                  ? 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800'
                                  : rest.cuisine_type?.toLowerCase().includes('japanese') || rest.cuisine_type?.toLowerCase().includes('sushi')
                                    ? 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800'
                                    : rest.cuisine_type?.toLowerCase().includes('steak')
                                      ? 'https://images.unsplash.com/photo-1432139548705-1744ad99741c?auto=format&fit=crop&q=80&w=800'
                                      : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'
                            }
                            alt={rest.rest_name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 rounded-lg text-xs font-bold text-gold border border-gold/30">
                            Avg: ${rest.average_price}
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">{rest.cuisine_type}</p>
                            <h3 className="text-xl font-serif font-bold mb-3">{rest.rest_name}</h3>
                            <p className="text-xs text-white/50 flex items-center gap-1"><MapPin size={12} /> {rest.address}</p>
                            <p className="text-xs text-white/50 pt-2">City: {rest.resolved_city || `City #${rest.city_id}`}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRest(rest); navigateTo('details'); }}
                            className="w-full py-3 mt-4 rounded-xl border border-gold/30 text-gold font-bold text-xs uppercase hover:bg-gold hover:text-black transition-all"
                          >
                            Reserve Table
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredRestaurants.length > visibleRestsCount && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setVisibleRestsCount(prev => prev + 24)}
                        className="gold-btn py-3 px-8 uppercase tracking-widest text-xs"
                      >
                        Show More Restaurants ({filteredRestaurants.length - visibleRestsCount} remaining)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== DETAILS PAGE ==================== */}
          {page === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-8 py-12 glass-panel rounded-3xl border border-white/10"
            >
              <button onClick={() => navigateTo('inventory')} className="text-white/50 hover:text-gold flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-6">
                <ChevronLeft size={16} /> Back to Catalog
              </button>

              {sector === 'cars' && selectedCar ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20">
                      <CarIcon className="text-gold w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gold uppercase tracking-[0.2em]">{selectedCar.brand}</span>
                      <h3 className="text-4xl font-serif font-bold">{selectedCar.model}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/10 text-center">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Year</span>
                      <span className="text-lg font-bold">{selectedCar.year}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Seats</span>
                      <span className="text-lg font-bold">{selectedCar.seats_number}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Transmission</span>
                      <span className="text-lg font-bold">{selectedCar.transmission_type}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Daily Price</span>
                      <span className="text-lg font-bold text-gold">${selectedCar.price_per_day}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-gold uppercase tracking-wider text-xs">Standard Features</h4>
                    <p className="text-sm text-white/60">
                      {selectedCar.car_features.join(', ')}
                    </p>
                  </div>

                  {/* Reviews & Feedbacks Section */}
                  <div className="pt-8 border-t border-white/10 space-y-6">
                    <h4 className="text-xl font-serif font-bold text-gold uppercase tracking-wider">Customer Reviews</h4>
                    <div className="space-y-4">
                      {reviews
                        .filter(r => Number(r.car_id) === Number(selectedCar.car_id))
                        .map(r => (
                          <div key={r.review_id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-left">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-sm text-white">{r.resolved_tourist}</p>
                                <p className="text-[10px] text-white/40">{r.review_date ? new Date(r.review_date).toLocaleDateString() : 'N/A'}</p>
                              </div>
                              {r.rating_score && (
                                <div className="flex items-center gap-1 text-gold text-xs font-bold">
                                  <Star size={12} className="fill-gold" /> {r.rating_score}/5
                                  {r.resolved_rating_type && <span className="text-white/40 font-normal">({r.resolved_rating_type})</span>}
                                </div>
                              )}
                            </div>
                            <p className="font-semibold text-xs text-gold">{r.review_title}</p>
                            <p className="text-xs text-white/70 italic">"{r.comment}"</p>
                          </div>
                        ))}
                      {reviews.filter(r => Number(r.car_id) === Number(selectedCar.car_id)).length === 0 && (
                        <p className="text-white/40 text-xs italic text-left">No reviews yet for this vehicle.</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Feedback Form */}
                  <div className="pt-8 border-t border-white/10 space-y-4 text-left">
                    <h4 className="text-lg font-serif font-bold text-gold uppercase tracking-wider">Leave a Review</h4>
                    {user ? (
                      <form onSubmit={(e) => handleReviewSubmit(e, 'car')} className="space-y-4">
                        {reviewError && (
                          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold text-center">
                            {reviewError}
                          </div>
                        )}
                        {reviewSuccess && (
                          <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                            {reviewSuccess}
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Review Title</label>
                            <input
                              type="text"
                              value={reviewTitle}
                              onChange={(e) => setReviewTitle(e.target.value)}
                              placeholder="E.g. Great experience!"
                              required
                              className="glass-input w-full px-4 py-2.5 rounded-xl text-black font-bold text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Rating Score</label>
                            <select
                              value={reviewRating}
                              onChange={(e) => setReviewRating(Number(e.target.value))}
                              className="glass-input w-full px-4 py-2.5 rounded-xl text-black font-bold text-sm"
                            >
                              <option value="5">5 Stars - Excellent</option>
                              <option value="4">4 Stars - Very Good</option>
                              <option value="3">3 Stars - Good</option>
                              <option value="2">2 Stars - Poor</option>
                              <option value="1">1 Star - Terrible</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Comment / Review Detail</label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience details with other community members..."
                            required
                            rows={3}
                            className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold text-sm resize-none"
                          />
                        </div>
                        <button type="submit" className="gold-btn py-3 px-8 text-xs uppercase tracking-widest font-bold">
                          Submit Feedback
                        </button>
                      </form>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm mb-3">You must be signed in to submit a review.</p>
                        <button onClick={() => navigateTo('login')} className="gold-btn py-2 px-6 text-xs">
                          Sign In Now
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigateTo('checkout')}
                    className="gold-btn w-full py-4 mt-8 uppercase tracking-widest text-sm"
                  >
                    Proceed to Booking
                  </button>
                </div>
              ) : sector === 'restaurants' && selectedRest ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20">
                      <UtensilsCrossed className="text-gold w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gold uppercase tracking-[0.2em]">{selectedRest.cuisine_type}</span>
                      <h3 className="text-4xl font-serif font-bold">{selectedRest.rest_name}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/10 text-center">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Cuisine</span>
                      <span className="text-lg font-bold">{selectedRest.cuisine_type}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Address</span>
                      <span className="text-lg font-bold text-sm block truncate">{selectedRest.address}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Avg Bill</span>
                      <span className="text-lg font-bold text-gold">${selectedRest.average_price}</span>
                    </div>
                  </div>

                  {/* Reviews & Feedbacks Section */}
                  <div className="pt-8 border-t border-white/10 space-y-6">
                    <h4 className="text-xl font-serif font-bold text-gold uppercase tracking-wider">Customer Reviews</h4>
                    <div className="space-y-4">
                      {reviews
                        .filter(r => Number(r.rest_id) === Number(selectedRest.rest_id))
                        .map(r => (
                          <div key={r.review_id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-left">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-sm text-white">{r.resolved_tourist}</p>
                                <p className="text-[10px] text-white/40">{r.review_date ? new Date(r.review_date).toLocaleDateString() : 'N/A'}</p>
                              </div>
                              {r.rating_score && (
                                <div className="flex items-center gap-1 text-gold text-xs font-bold">
                                  <Star size={12} className="fill-gold" /> {r.rating_score}/5
                                  {r.resolved_rating_type && <span className="text-white/40 font-normal">({r.resolved_rating_type})</span>}
                                </div>
                              )}
                            </div>
                            <p className="font-semibold text-xs text-gold">{r.review_title}</p>
                            <p className="text-xs text-white/70 italic">"{r.comment}"</p>
                          </div>
                        ))}
                      {reviews.filter(r => Number(r.rest_id) === Number(selectedRest.rest_id)).length === 0 && (
                        <p className="text-white/40 text-xs italic text-left">No reviews yet for this dining spot.</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Feedback Form */}
                  <div className="pt-8 border-t border-white/10 space-y-4 text-left">
                    <h4 className="text-lg font-serif font-bold text-gold uppercase tracking-wider">Leave a Review</h4>
                    {user ? (
                      <form onSubmit={(e) => handleReviewSubmit(e, 'restaurant')} className="space-y-4">
                        {reviewError && (
                          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold text-center">
                            {reviewError}
                          </div>
                        )}
                        {reviewSuccess && (
                          <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                            {reviewSuccess}
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Review Title</label>
                            <input
                              type="text"
                              value={reviewTitle}
                              onChange={(e) => setReviewTitle(e.target.value)}
                              placeholder="E.g. Amazing dining!"
                              required
                              className="glass-input w-full px-4 py-2.5 rounded-xl text-black font-bold text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Rating Score</label>
                            <select
                              value={reviewRating}
                              onChange={(e) => setReviewRating(Number(e.target.value))}
                              className="glass-input w-full px-4 py-2.5 rounded-xl text-black font-bold text-sm"
                            >
                              <option value="5">5 Stars - Excellent</option>
                              <option value="4">4 Stars - Very Good</option>
                              <option value="3">3 Stars - Good</option>
                              <option value="2">2 Stars - Poor</option>
                              <option value="1">1 Star - Terrible</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Comment / Review Detail</label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your dining experience details with other community members..."
                            required
                            rows={3}
                            className="glass-input w-full px-4 py-3 rounded-xl text-black font-bold text-sm resize-none"
                          />
                        </div>
                        <button type="submit" className="gold-btn py-3 px-8 text-xs uppercase tracking-widest font-bold">
                          Submit Feedback
                        </button>
                      </form>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm mb-3">You must be signed in to submit a review.</p>
                        <button onClick={() => navigateTo('login')} className="gold-btn py-2 px-6 text-xs">
                          Sign In Now
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigateTo('checkout')}
                    className="gold-btn w-full py-4 mt-8 uppercase tracking-widest text-sm"
                  >
                    Proceed to Table Booking
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* ==================== CHECKOUT PAGE ==================== */}
          {page === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto px-6 glass-panel p-8 rounded-3xl border border-white/10"
            >
              <button onClick={() => navigateTo('details')} className="text-white/50 hover:text-gold flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-6">
                <ChevronLeft size={16} /> Back to Details
              </button>

              <h3 className="text-3xl font-serif font-bold text-gold mb-6 uppercase">Confirm Details</h3>

              {sector === 'cars' && selectedCar ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-sm mb-4">
                    <p className="font-bold text-gold">Vehicle Selected:</p>
                    <p className="text-lg font-serif">{selectedCar.brand} {selectedCar.model}</p>
                    <p className="text-xs text-white/50">Total price: ${selectedCar.price_per_day * 4}</p>
                  </div>
                  <button onClick={confirmCarBooking} className="gold-btn w-full py-4 uppercase tracking-widest text-sm">
                    Book Vehicle (Write to DB)
                  </button>
                </div>
              ) : sector === 'restaurants' && selectedRest ? (
                <form onSubmit={confirmRestBooking} className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-sm mb-4">
                    <p className="font-bold text-gold">Restaurant Selected:</p>
                    <p className="text-lg font-serif">{selectedRest.rest_name}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Number of Guests</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold"
                      value={restSearchParams.peopleNum}
                      onChange={(e) => setRestSearchParams({ ...restSearchParams, peopleNum: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest block">Reservation Date</label>
                    <input
                      type="date"
                      required
                      className="glass-input w-full px-4 py-2 rounded-xl text-black font-bold"
                      value={restSearchParams.bookingDate}
                      onChange={(e) => setRestSearchParams({ ...restSearchParams, bookingDate: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="gold-btn w-full py-4 uppercase tracking-widest text-sm mt-4">
                    Book Restaurant Table
                  </button>
                </form>
              ) : null}
            </motion.div>
          )}

          {/* ==================== SUCCESS PAGE ==================== */}
          {page === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto px-6 text-center glass-panel p-10 rounded-3xl border border-white/10 space-y-6"
            >
              <div className="w-16 h-16 bg-gold/20 border border-gold/30 text-gold rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-gold">Booking Complete!</h3>
              <p className="text-white/60">
                Your reservation was successfully processed and written to PostgreSQL.
              </p>
              <div className="flex gap-4">
                <button onClick={() => navigateTo('home')} className="gold-btn flex-grow py-3 text-xs uppercase tracking-widest">
                  Home
                </button>
                <button onClick={() => navigateTo('history')} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest flex-grow">
                  History
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== HISTORY PAGE ==================== */}
          {page === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto px-6"
            >
              <h3 className="text-3xl font-serif font-bold text-gold mb-8 uppercase tracking-wide">My Travel & Dining History</h3>

              <div className="space-y-6">
                {userBookings.map(b => (
                  <div key={b.booking_id} className="glass-panel p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-serif font-bold">{b.resolved_car || b.resolved_restaurant}</h4>
                      <p className="text-xs text-white/50">
                        {b.resolved_car ? 'Car Rental Booking' : 'Restaurant Reservation'}
                      </p>
                      <p className="text-[10px] text-white/40">
                        Date: {new Date(b.booking_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        {b.status}
                      </span>
                      <button
                        onClick={() => setViewingBooking(b)}
                        className="gold-btn py-2 px-4 text-xs font-bold uppercase tracking-wider"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
                {userBookings.length === 0 && (
                  <p className="text-white/40 text-center italic">No booking records found.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== ADMIN CRUD PAGE ==================== */}
          {page === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* CRUD Config form panel */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-xl font-serif font-bold text-gold flex items-center gap-2"><Database size={20} /> CRUD Control</h3>

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Active Table</label>
                    <select
                      className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                    >
                      {Object.keys(TABLE_SCHEMAS).map(t => (
                        <option key={t} value={t}>{TABLE_SCHEMAS[t].label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Display Limit</label>
                    <select
                      className="glass-input w-full px-4 py-3 rounded-xl font-bold text-black"
                      value={crudLimit}
                      onChange={(e) => setCrudLimit(e.target.value)}
                    >
                      <option value="100">100 rows</option>
                      <option value="500">500 rows</option>
                      <option value="1000">1000 rows</option>
                      <option value="5000">5000 rows</option>
                      <option value="all">All rows</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <label className="text-[10px] font-gold text-gold uppercase tracking-widest block font-bold">Fetch Key ID for Update</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ID / Primary Key"
                        value={crudSearchId}
                        onChange={(e) => setCrudSearchId(e.target.value)}
                        className="glass-input flex-grow px-3 py-2 rounded-xl text-black font-bold text-sm"
                      />
                      <button
                        onClick={handleCrudFetch}
                        className="bg-gold hover:bg-gold-dark text-black font-bold text-xs px-4 py-2 rounded-xl"
                      >
                        Fetch
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <h4 className="font-serif font-bold text-lg text-gold">{isEditMode ? 'Edit Row Values' : 'Create Row Values'}</h4>
                  <form onSubmit={handleCrudSubmit} className="space-y-3">
                    {TABLE_SCHEMAS[selectedTable].fields.map(f => (
                      <div key={f.name} className="space-y-1">
                        <label className="text-[10px] font-bold text-white/50 block">{f.label}</label>
                        <input
                          type={f.type}
                          required={f.required}
                          disabled={isEditMode && f.name === TABLE_SCHEMAS[selectedTable].pk}
                          value={f.type === 'date' && typeof crudFormData[f.name] === 'string' ? crudFormData[f.name].split('T')[0] : (crudFormData[f.name] || '')}
                          onChange={(e) => setCrudFormData({ ...crudFormData, [f.name]: e.target.value })}
                          className="glass-input w-full px-3 py-2 rounded-xl text-black text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    ))}
                    <button type="submit" className="gold-btn w-full py-3 mt-4 text-xs uppercase tracking-widest">
                      {isEditMode ? 'Save Updates' : 'Create Record'}
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => { setCrudFormData({}); setIsEditMode(false); }}
                        className="w-full py-2 mt-2 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-center"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>

                {crudError && <div className="p-4 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold">Error: {crudError}</div>}
                {crudSuccess && <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold">{crudSuccess}</div>}
              </div>

              {/* Dynamic Rows table */}
              <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[700px]">
                <h3 className="text-xl font-serif font-bold mb-4">{TABLE_SCHEMAS[selectedTable].label} Rows</h3>
                <div className="flex-grow overflow-auto">
                  <table className="min-w-max w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gold font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-4 whitespace-nowrap">Actions</th>
                        <th className="py-2.5 px-4 whitespace-nowrap">{TABLE_SCHEMAS[selectedTable].pk}</th>
                        {TABLE_SCHEMAS[selectedTable].fields.map(f => (
                          <th key={f.name} className="py-2.5 px-4 whitespace-nowrap">{f.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map(row => {
                        const pkVal = row[TABLE_SCHEMAS[selectedTable].pk];
                        return (
                          <tr key={pkVal} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-2.5 px-4 flex gap-2">
                              <button onClick={() => { setCrudFormData(row); setIsEditMode(true); }} className="text-blue-400"><Edit size={14} /></button>
                              <button onClick={() => handleCrudDelete(pkVal)} className="text-red-400"><Trash2 size={14} /></button>
                            </td>
                            <td className="py-2.5 px-4 font-mono font-bold whitespace-nowrap">{pkVal}</td>
                            {TABLE_SCHEMAS[selectedTable].fields.map(f => (
                              <td key={f.name} className="py-2.5 px-4 whitespace-nowrap">{renderCell(f.name, row)}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== BUSINESS INSIGHTS PAGE ==================== */}
          {page === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Stored procedures, functions buttons */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-gold"><Activity size={20} /> Business Utilities</h3>

                  {/* Button 1: Procedure pr_apply_strategic_discounts */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <button
                      onClick={runDiscountProcedure}
                      className="gold-btn w-full text-xs uppercase tracking-widest"
                    >
                      Apply Strategic Discounting (10%)
                    </button>
                  </div>

                  {/* Button 2: Procedure pr_book_integrated_package */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center transition-all">
                    {!showPkgForm ? (
                      <button
                        onClick={() => setShowPkgForm(true)}
                        className="gold-btn w-full text-xs uppercase tracking-widest"
                      >
                        Book Integrated Package
                      </button>
                    ) : (
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Book Integrated Package (Procedure)</p>
                          <button onClick={() => setShowPkgForm(false)} className="text-white/50 hover:text-white text-xs">✕</button>
                        </div>
                        <form onSubmit={runBookPackageProcedure} className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder="Tourist ID" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.touristId} onChange={e => setPkgFormData({...pkgFormData, touristId: e.target.value})} required />
                            <input type="number" placeholder="Car ID" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.carId} onChange={e => setPkgFormData({...pkgFormData, carId: e.target.value})} required />
                            <input type="number" placeholder="Pickup City ID" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.pickupCityId} onChange={e => setPkgFormData({...pkgFormData, pickupCityId: e.target.value})} required />
                            <input type="number" placeholder="Return City ID" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.returnCityId} onChange={e => setPkgFormData({...pkgFormData, returnCityId: e.target.value})} required />
                            <input type="date" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.pickupDate} onChange={e => setPkgFormData({...pkgFormData, pickupDate: e.target.value})} required />
                            <input type="date" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.returnDate} onChange={e => setPkgFormData({...pkgFormData, returnDate: e.target.value})} required />
                            <input type="number" placeholder="Rest ID" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.restId} onChange={e => setPkgFormData({...pkgFormData, restId: e.target.value})} required />
                            <input type="date" className="glass-input px-2 py-1 text-[10px] rounded-lg" value={pkgFormData.restBookingDate} onChange={e => setPkgFormData({...pkgFormData, restBookingDate: e.target.value})} required />
                            <input type="number" placeholder="Num of People" className="glass-input px-2 py-1 text-[10px] rounded-lg col-span-2" value={pkgFormData.numOfPeople} onChange={e => setPkgFormData({...pkgFormData, numOfPeople: e.target.value})} required />
                          </div>
                          <button type="submit" className="gold-btn w-full text-[10px] py-1.5 uppercase tracking-widest mt-2">
                            Execute Booking
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Button 2: Function fn_calculate_city_health_index */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={healthIndexCity}
                        onChange={(e) => setHealthIndexCity(e.target.value)}
                        placeholder="Enter City Name"
                        className="glass-input px-3 py-1.5 rounded-xl text-xs text-black font-bold flex-grow"
                      />
                      <button
                        onClick={runCityHealthIndex}
                        className="bg-gold text-black font-bold text-xs py-1.5 px-4 rounded-xl hover:bg-gold-dark"
                      >
                        Calculate Performance Index
                      </button>
                    </div>
                    {healthIndexScore !== null && <p className="text-xs text-emerald-500 font-bold text-center">Performance Index Score: {healthIndexScore}/100</p>}
                  </div>

                  {/* Button 3: Function fn_get_tourist_activity (Cursor) */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={activityTouristId}
                        onChange={(e) => setActivityTouristId(e.target.value)}
                        placeholder="Enter Tourist ID"
                        className="glass-input px-3 py-1.5 rounded-xl text-xs text-black font-bold flex-grow"
                      />
                      <button
                        onClick={runTouristActivity}
                        className="bg-gold text-black font-bold text-xs py-1.5 px-4 rounded-xl hover:bg-gold-dark"
                      >
                        Fetch Customer Activity Log
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notices Console */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 flex flex-col h-64">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gold border-b border-white/10 pb-2">Business Activity Log</h4>
                  <div className="flex-grow overflow-auto bg-black/60 p-4 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1 text-left">
                    {subprogramLogs.map((log, i) => {
                      const cleanLog = log
                        .replace(/public\./g, '')
                        .replace(/Calling procedure/g, 'Executing routine')
                        .replace(/Calling function/g, 'Executing routine')
                        .replace(/\(Cursor\)/g, '');
                      return <div key={i} className="leading-tight">{cleanLog}</div>;
                    })}
                    {subprogramLogs.length === 0 && <span className="text-white/20 italic">No activity recorded. Run a routine to display logs.</span>}
                  </div>
                </div>
              </div>

              {/* Predefined Dynamic Reports */}
              <div className="lg:col-span-7 space-y-6">

                {/* Report 1 Button */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <button
                    onClick={runJerusalemCarsQuery}
                    className="gold-btn w-full text-xs uppercase tracking-widest text-center"
                  >
                    View Available Cars in Jerusalem
                  </button>
                  {jcarsResult.length > 0 && (
                    <div className="max-h-52 overflow-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-white/50">
                            <th>ID</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Price</th>
                            <th>Company</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jcarsResult.map(r => (
                            <tr key={r.car_id} className="border-b border-white/5">
                              <td>{r.car_id}</td>
                              <td>{r.brand}</td>
                              <td>{r.model}</td>
                              <td className="text-gold font-bold">${r.price_per_day}</td>
                              <td>{r.company_name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Report 2 Button */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <button
                    onClick={runRecommendedQuery}
                    className="gold-btn w-full text-xs uppercase tracking-widest text-center"
                  >
                    View High-Rated Vehicles (4+ Stars)
                  </button>
                  {recommendedResult.length > 0 && (
                    <div className="max-h-52 overflow-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-white/50">
                            <th>ID</th>
                            <th>Specs</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recommendedResult.map(r => (
                            <tr key={r.car_id} className="border-b border-white/5">
                              <td>{r.car_id}</td>
                              <td>{r.brand} {r.model}</td>
                              <td>{r.car_type}</td>
                              <td>${r.price_per_day}</td>
                              <td className="text-gold font-bold">{r.average_score}/5</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Refcursor Cursor Rows viewer */}
                {activityRows.length > 0 && (
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="font-serif font-bold text-lg text-gold">Customer Travel & Booking Logs</h4>
                    <div className="max-h-56 overflow-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-white/50">
                            <th>Review ID</th>
                            <th>Title</th>
                            <th>Score</th>
                            <th>Type</th>
                            <th>Spend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityRows.map(r => (
                            <tr key={r.review_id} className="border-b border-white/5">
                              <td>{r.review_id}</td>
                              <td>{r.review_title}</td>
                              <td className="font-bold text-gold">{r.score}</td>
                              <td>{r.rating_type}</td>
                              <td className="text-emerald-400 font-bold">${r.cumulative_car_spend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== LOGIN PAGE ==================== */}
          {page === 'login' && (
            <AuthGate
              onLogin={(profile) => { handleLogin(profile); navigateTo('home'); }}
              onCancel={() => navigateTo('home')}
            />
          )}

          {/* ==================== PROFILE PAGE ==================== */}
          {page === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full py-10"
            >
              <ProfilePage
                user={user}
                onUpdateUser={(updatedProfile) => {
                  setUser(updatedProfile);
                  localStorage.setItem('rentcars_user', JSON.stringify(updatedProfile));
                }}
                navigateTo={navigateTo}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Viewing booking modal */}
      {viewingBooking && <BookingDetailModal booking={viewingBooking} onClose={() => setViewingBooking(null)} />}
    </div>
  );
}
