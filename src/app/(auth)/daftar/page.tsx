"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction } from "../../actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-submit w-100" disabled={pending}>
      {pending ? (
        <><span className="spinner-border spinner-border-sm me-2"></span>Memproses...</>
      ) : (
        <><span className="btn-text">Daftar Sekarang - Gratis!</span><i className="fas fa-arrow-right ms-2"></i></>
      )}
    </button>
  );
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, formAction] = useActionState(registerAction, null);

  return (
    <div className="auth-form-inner">
      <div className="form-header">
        <h1 className="form-title">Mulai Belajar Hari Ini!</h1>
        <p className="form-subtitle">Daftar gratis dan akses ratusan kursus berkualitas.</p>
      </div>

      {state?.error && (
        <div className="alert alert-danger" style={{ borderRadius: '12px', fontSize: '14px' }}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {state.error}
        </div>
      )}

      <form action={formAction} noValidate>
        <div className="form-group-custom">
          <label htmlFor="name" className="form-label-custom">Nama Lengkap</label>
          <div className="input-wrapper">
            <i className="fas fa-user input-icon"></i>
            <input type="text" id="name" name="name" className="form-input-custom" placeholder="Nama lengkap Anda" required autoComplete="name" />
          </div>
        </div>

        <div className="form-group-custom">
          <label htmlFor="email" className="form-label-custom">Alamat Email</label>
          <div className="input-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input type="email" id="email" name="email" className="form-input-custom" placeholder="contoh@email.com" required autoComplete="email" />
          </div>
        </div>

        <div className="form-group-custom">
          <label htmlFor="password" className="form-label-custom mb-0">Password</label>
          <div className="input-wrapper mt-2">
            <i className="fas fa-lock input-icon"></i>
            <input type={showPassword ? "text" : "password"} id="password" name="password" className="form-input-custom" placeholder="Minimal 8 karakter" required autoComplete="new-password" />
            <button type="button" className="toggle-password border-0 bg-transparent" onClick={() => setShowPassword(!showPassword)}>
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </button>
          </div>
        </div>

        <div className="form-group-custom">
          <label htmlFor="confirm_password" className="form-label-custom mb-0">Konfirmasi Password</label>
          <div className="input-wrapper mt-2">
            <i className="fas fa-lock input-icon"></i>
            <input type={showConfirmPassword ? "text" : "password"} id="confirm_password" name="confirm_password" className="form-input-custom" placeholder="Ulangi password Anda" required autoComplete="new-password" />
            <button type="button" className="toggle-password border-0 bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </button>
          </div>
        </div>

        <div className="form-check-custom mb-3">
          <input type="checkbox" id="terms" name="terms" className="form-check-input-custom" required />
          <label htmlFor="terms" className="form-check-label-custom">
            Saya setuju dengan <Link href="#" className="text-decoration-none">Syarat & Ketentuan</Link> dan <Link href="#" className="text-decoration-none">Kebijakan Privasi</Link>
          </label>
        </div>

        <SubmitButton />
      </form>

      <p className="auth-switch mt-4">
        Sudah punya akun? <Link href="/masuk" className="text-decoration-none">Masuk di sini</Link>
      </p>
    </div>
  );
}
