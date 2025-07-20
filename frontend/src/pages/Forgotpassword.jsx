import React from 'react';
import { useForm } from 'react-hook-form';
import forgotPasswordImage from '../assets/resetpassword.avif'; // You can rename it if needed

const Forgotpassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Forgot Password Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="eco-forgot-wrapper">
      <div className="eco-forgot-card">
        <div className="eco-forgot-image">
          <img src={forgotPasswordImage} alt="Forgot Password" />
        </div>

        <div className="eco-forgot-form">
          <h2>Forgot Your Password?</h2>
          <p className="eco-info-text">
            Enter your email address below and we'll send you a password reset link.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="eco-form-group">
              <label>Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="eco-error">{errors.email.message}</p>}
            </div>

            <button type="submit" className="eco-reset-btn">Send Reset Link</button>
          </form>
        </div>
      </div>

      {/* Scoped CSS */}
      <style>{`
        .eco-forgot-wrapper {
          min-height: 100vh;
          background-color: #eef6f3;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .eco-forgot-card {
          display: flex;
          flex-direction: row;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          width: 100%;
        }

        .eco-forgot-image {
          flex: 1;
          display: none;
        }

        .eco-forgot-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .eco-forgot-form {
          flex: 1;
          padding: 32px;
        }

        .eco-forgot-form h2 {
          margin-bottom: 10px;
          color: #2f855a;
        }

        .eco-info-text {
          font-size: 14px;
          margin-bottom: 24px;
          color: #555;
        }

        .eco-form-group {
          margin-bottom: 18px;
        }

        .eco-form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
        }

        .eco-form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .eco-error {
          color: red;
          font-size: 13px;
          margin-top: 5px;
        }

        .eco-reset-btn {
          width: 100%;
          background-color: #2f855a;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .eco-reset-btn:hover {
          background-color: #276749;
        }

        @media (min-width: 768px) {
          .eco-forgot-image {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default Forgotpassword;
