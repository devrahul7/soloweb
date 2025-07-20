import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import registerImage from '../assets/register.png';
import '../cssfolder/Register.css';

export default function Register() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    console.log(data)
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const response = await res.json()
      console.log(response)

      if (res.ok) {
        alert('Registration successful!');
        reset();
        navigate('/login');
      } else {
        alert('Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Navbar />
      <div className="ecoSajha__main-wrapper">
        <div className="ecoSajha__page-container">
          <div className="ecoSajha__content-grid">
            
            {/* Left Side - Image */}
            <div className="ecoSajha__image-column">
              <div className="ecoSajha__image-container">
                <img src={registerImage} alt="EcoSajha Registration" className="ecoSajha__register-image" />
                <div className="ecoSajha__image-content">
                  <h2>Join the Green Revolution</h2>
                  <p>Transform waste into wealth with Nepal's leading recycling platform</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="ecoSajha__form-column">
              <div className="ecoSajha__form-wrapper">
                
                {/* Header */}
                <div className="ecoSajha__form-header">
                  <div className="ecoSajha__logo-container">
                    <div className="ecoSajha__logo">♻️</div>
                  </div>
                  <h1 className="ecoSajha__main-title">Create Account</h1>
                  <p className="ecoSajha__main-subtitle">Join EcoSajha and start your sustainable journey</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="ecoSajha__registration-form">
                  
                  <div className="ecoSajha__input-row">
                    <div className="ecoSajha__field-group">
                      <label className="ecoSajha__field-label">Full Name</label>
                      <input 
                        {...register("fullName", { required: true })} 
                        placeholder="Enter your full name"
                        className="ecoSajha__field-input"
                      />
                    </div>
                  </div>

                  <div className="ecoSajha__input-row">
                    <div className="ecoSajha__field-group">
                      <label className="ecoSajha__field-label">Email Address</label>
                      <input 
                        type="email" 
                        {...register("email", { required: true })} 
                        placeholder="your.email@example.com"
                        className="ecoSajha__field-input"
                      />
                    </div>
                  </div>

                  <div className="ecoSajha__input-row">
                    <div className="ecoSajha__field-group">
                      <label className="ecoSajha__field-label">Password</label>
                      <div className="ecoSajha__password-container">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          {...register("password", { required: true })} 
                          placeholder="Create a strong password"
                          className="ecoSajha__field-input"
                        />
                        <button 
                          type="button" 
                          className="ecoSajha__password-btn"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="ecoSajha__input-row ecoSajha__input-row--split">
                    <div className="ecoSajha__field-group">
                      <label className="ecoSajha__field-label">Phone Number</label>
                      <input 
                        type="tel" 
                        {...register("phone", { required: true })} 
                        placeholder="+977 98XXXXXXXX"
                        className="ecoSajha__field-input"
                      />
                    </div>
                    <div className="ecoSajha__field-group">
                      <label className="ecoSajha__field-label">Address</label>
                      <input 
                        {...register("address", { required: true })} 
                        placeholder="Street, Ward, District"
                        className="ecoSajha__field-input"
                      />
                    </div>
                  </div>

                  <div className="ecoSajha__input-row">
                    <div className="ecoSajha__field-group">
                      <label className="ecoSajha__field-label">Primary Waste Type</label>
                      <select {...register("wasteType", { required: true })} className="ecoSajha__field-select">
                        <option value="">Choose your primary waste type</option>
                        <option value="paper">📄 Paper & Cardboard</option>
                        <option value="plastic">🥤 Glass & Plastic</option>
                        <option value="metal">🔧 Metal & Steel</option>
                        <option value="electronic">💻 E-waste</option>
                        <option value="mixed">♻️ Mixed Recyclables</option>
                        <option value="organic">🌱 Organic Waste</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="ecoSajha__submit-button">
                    <span>Create My Account</span>
                    <svg className="ecoSajha__button-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                </form>

                {/* Login Link */}
                <div className="ecoSajha__form-footer">
                  <p>Already have an account? 
                    <a onClick={() => navigate('/login')} className="ecoSajha__login-link">
                      Sign in here
                    </a>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
