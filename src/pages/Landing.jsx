import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <>
      <style>{`
        .landing-body {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
        }
        .landing-body::before, .landing-body::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .landing-body::before {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(232,180,195,.18) 0%, transparent 70%);
          top: -80px; right: -80px;
        }
        .landing-body::after {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(201,184,232,.15) 0%, transparent 70%);
          bottom: -60px; left: -60px;
        }
        .landing-card {
          background: #fffafc;
          padding: 50px 44px 44px;
          border-radius: 28px;
          box-shadow: 0 4px 6px rgba(180,140,160,.12), 0 20px 40px rgba(180,140,160,.12), 0 0 0 1px rgba(232,180,195,.2);
          text-align: center;
          max-width: 420px;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .landing-card::before {
          content: '';
          display: block;
          width: 60px; height: 4px;
          background: linear-gradient(90deg, #e8b4c3, #c9b8e8, #f2c9b8);
          border-radius: 2px;
          margin: 0 auto 28px;
        }
        .landing-icon { font-size: 2.4rem; margin-bottom: 16px; line-height: 1; }
        .landing-subtitle {
          font-size: .82rem; font-weight: 400; letter-spacing: 2px;
          text-transform: uppercase; color: #e8b4c3; margin-bottom: 10px;
        }
        .landing-h1 {
          font-family: 'Playfair Display', serif;
          color: #9c7ea8; font-weight: 500; font-size: 2rem;
          margin-bottom: 8px; letter-spacing: .5px;
        }
        .landing-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,184,232,.4), transparent);
          margin: 22px 0;
        }
        .landing-msg {
          font-size: .97rem; color: #a8919e; line-height: 1.7;
          margin-bottom: 32px; font-weight: 300;
        }
        .landing-links { display: flex; flex-direction: column; gap: 14px; }
        .landing-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          text-decoration: none; padding: 14px 22px; border-radius: 50px;
          font-family: 'Lato', sans-serif; font-weight: 500; font-size: .95rem;
          letter-spacing: .3px; transition: all .3s ease;
        }
        .btn-insta {
          background: linear-gradient(135deg, #edd5f5, #e0c8f0);
          color: #8a69a8; border: 1px solid rgba(201,184,232,.5);
        }
        .btn-insta:hover {
          background: linear-gradient(135deg, #e5c8f0, #d6bce8);
          transform: translateY(-2px); box-shadow: 0 6px 16px rgba(180,140,220,.2);
        }
        .btn-wa {
          background: linear-gradient(135deg, #c8e8d8, #b8d8c9);
          color: #4a8a6a; border: 1px solid rgba(184,216,201,.6);
        }
        .btn-wa:hover {
          background: linear-gradient(135deg, #bce0ce, #aacfbe);
          transform: translateY(-2px); box-shadow: 0 6px 16px rgba(140,200,170,.25);
        }
        .landing-footer { margin-top: 28px; font-size: .78rem; color: #c9b8c4; letter-spacing: .5px; }
        .login-link {
          position: fixed; top: 18px; right: 22px; z-index: 10;
          font-size: .82rem; color: #a8919e; text-decoration: none;
          border: 1px solid rgba(201,184,232,.5); border-radius: 20px;
          padding: 6px 16px; background: rgba(255,250,252,.9);
          backdrop-filter: blur(4px); transition: all .2s;
          font-family: 'Lato', sans-serif;
        }
        .login-link:hover { color: #9c7ea8; border-color: #c9b8e8; background: #fffafc; }
      `}</style>

      <Link to="/login" className="login-link">Iniciar sesión</Link>

      <div className="landing-body">
        <div className="landing-card">
          <div className="landing-icon">🌸</div>
          <p className="landing-subtitle">Bienvenida</p>
          <h1 className="landing-h1">Romina Paladea</h1>

          <div className="landing-divider" />

          <p className="landing-msg">
            Estoy preparando algo especial para vos.<br />
            Muy pronto podés encontrarme aquí.
          </p>

          <div className="landing-links">
            <a href="https://www.instagram.com/romipaladea" target="_blank" rel="noreferrer" className="landing-btn btn-insta">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @romipaladea
            </a>
            <a href="https://wa.me/541158825314" target="_blank" rel="noreferrer" className="landing-btn btn-wa">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar por WhatsApp
            </a>
          </div>

          <p className="landing-footer">✨ Próximamente ✨</p>
        </div>
      </div>
    </>
  )
}
