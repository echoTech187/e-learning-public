"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, dummyLoginAction } from "../../actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-submit w-100" disabled={pending}>
      {pending ? (
        <><span className="spinner-border spinner-border-sm me-2"></span>Memproses...</>
      ) : (
        <><span className="btn-text">Masuk Sekarang</span><i className="fas fa-arrow-right ms-2"></i></>
      )}
    </button>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className="auth-form-inner">
      <div className="form-header">
        <h1 className="form-title">Selamat Datang Kembali!</h1>
        <p className="form-subtitle">Masuk untuk melanjutkan perjalanan belajar Anda.</p>
      </div>

      {state?.error && (
        <div className="alert alert-danger" style={{ borderRadius: '12px', fontSize: '14px' }}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {state.error}
        </div>
      )}

      <form action={formAction} noValidate>
        <div className="form-group-custom">
          <label htmlFor="email" className="form-label-custom">Alamat Email</label>
          <div className="input-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input type="email" id="email" name="email" className="form-input-custom" placeholder="contoh@email.com" required autoComplete="email" />
          </div>
        </div>

        <div className="form-group-custom">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label htmlFor="password" className="form-label-custom mb-0">Password</label>
            <Link href="#" className="forgot-link text-decoration-none">Lupa Password?</Link>
          </div>
          <div className="input-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input type={showPassword ? "text" : "password"} id="password" name="password" className="form-input-custom" placeholder="Masukkan password Anda" required autoComplete="current-password" />
            <button type="button" className="toggle-password border-0 bg-transparent" onClick={() => setShowPassword(!showPassword)}>
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </button>
          </div>
        </div>

        <div className="form-check-custom mb-3">
          <input type="checkbox" id="remember" name="remember" className="form-check-input-custom" />
          <label htmlFor="remember" className="form-check-label-custom">Ingat saya selama 7 hari</label>
        </div>

        <SubmitButton />
      </form>


      <div className="divider-custom">
        <span>atau masuk dengan</span>
      </div>

      <div className="social-login">
        <button type="button" className="btn-social btn-google" disabled title="Segera hadir">
          <i className="fab fa-google"></i>
          <span>Google</span>
        </button>
        <button type="button" className="btn-social btn-facebook" disabled title="Segera hadir">
          <i className="fab fa-facebook-f"></i>
          <span>Facebook</span>
        </button>
      </div>

      <p className="auth-switch">
        Belum punya akun? <Link href="/daftar" className="text-decoration-none">Daftar Gratis</Link>
      </p>
    </div>
  );
}

