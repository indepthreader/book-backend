import { useEffect, useState } from "react";
import { fetchPublicSettings } from "../lib/public";

function usePublicSettings() {
  const [settings, setSettings] = useState({
    FRONTEND_URL: "",
    CONTACT_NAME: "",
    CONTACT_EMAIL: "",
    CONTACT_PHONE: "",
    CONTACT_WHATSAPP: "",
  });

  useEffect(() => {
    let ignore = false;

    fetchPublicSettings()
      .then((result) => {
        if (!ignore) setSettings(result);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  return settings;
}

function PublicLayout({ title, subtitle, children }) {
  return (
    <>
      <style>{`
        .public-shell {
          min-height: 100vh;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(255, 122, 89, 0.14), transparent 32%),
            linear-gradient(180deg, #0b0b0d 0%, #121218 100%);
          color: #f5f2ec;
        }
        .public-wrap {
          max-width: 980px;
          margin: 0 auto;
          display: grid;
          gap: 18px;
        }
        .public-topbar,
        .public-card {
          background: rgba(18, 18, 24, 0.92);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 18px 50px rgba(0,0,0,0.24);
        }
        .public-topbar {
          padding: 16px 18px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .public-brand {
          color: #f7f4ef;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .public-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .public-link {
          color: #d9d1dc;
          text-decoration: none;
          font-size: 0.95rem;
        }
        .public-card {
          padding: 24px;
        }
        .public-kicker {
          margin: 0 0 8px;
          color: #ffb39d;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .public-title {
          margin: 0 0 12px;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1;
        }
        .public-subtitle {
          margin: 0;
          max-width: 760px;
          color: #b6afbb;
          line-height: 1.7;
        }
        .public-section {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }
        .public-section h2 {
          margin: 0;
          font-size: 1.15rem;
        }
        .public-section p,
        .public-section li {
          margin: 0;
          color: #cdc7d0;
          line-height: 1.8;
        }
        .public-list {
          padding-left: 18px;
          display: grid;
          gap: 8px;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
          margin-top: 20px;
        }
        .contact-item {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: #0d0d12;
          padding: 18px;
        }
        .contact-label {
          margin: 0 0 6px;
          color: #ffb39d;
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .contact-value,
        .contact-value a {
          color: #f6f2ec;
          text-decoration: none;
          line-height: 1.7;
          word-break: break-word;
        }
        @media (max-width: 640px) {
          .public-shell {
            padding: 14px;
          }
          .public-topbar,
          .public-card {
            border-radius: 18px;
          }
          .public-card {
            padding: 18px;
          }
        }
      `}</style>

      <section className="public-shell">
        <div className="public-wrap">
          <nav className="public-topbar">
            <a href="/" className="public-brand">
              InDepth
            </a>
            <div className="public-links">
              <a className="public-link" href="/">
                Home
              </a>
              <a className="public-link" href="/privacy">
                Privacy
              </a>
              <a className="public-link" href="/terms">
                Terms
              </a>
              <a className="public-link" href="/contact">
                Contact
              </a>
            </div>
          </nav>

          <section className="public-card">
            <p className="public-kicker">Public Page</p>
            <h1 className="public-title">{title}</h1>
            <p className="public-subtitle">{subtitle}</p>
            {children}
          </section>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  const settings = usePublicSettings();

  return (
    <PublicLayout
      title="Privacy Policy"
      subtitle="This public privacy page explains what user data is collected, how it is used, and how users can contact the platform regarding privacy questions."
    >
      <div className="public-section">
        <h2>What we collect</h2>
        <p>
          We may collect account details such as name, email address, phone
          number, profile preferences, uploaded content, payment metadata, and
          app usage information needed to run the platform securely.
        </p>
      </div>
      <div className="public-section">
        <h2>How we use data</h2>
        <ul className="public-list">
          <li>To create and manage user accounts</li>
          <li>To process subscriptions and payment confirmations</li>
          <li>To deliver AI, reading, and community features</li>
          <li>To monitor security, abuse, and service health</li>
        </ul>
      </div>
      <div className="public-section">
        <h2>Contact for privacy requests</h2>
        <p>
          For privacy questions or data-related requests, contact{" "}
          {settings.CONTACT_NAME ? settings.CONTACT_NAME : "Not configured yet"}
          {settings.CONTACT_EMAIL ? ` at ${settings.CONTACT_EMAIL}.` : "."}
        </p>
      </div>
    </PublicLayout>
  );
}

export function TermsPage() {
  const settings = usePublicSettings();

  return (
    <PublicLayout
      title="Terms of Service"
      subtitle="This public terms page describes the basic rules for using the platform, subscriptions, community posting, and acceptable usage."
    >
      <div className="public-section">
        <h2>Use of the service</h2>
        <p>
          Users must use the platform lawfully, respect other users, and avoid
          posting abusive, deceptive, or harmful content.
        </p>
      </div>
      <div className="public-section">
        <h2>Subscriptions and billing</h2>
        <p>
          Paid plans may unlock premium features. Billing providers such as
          Razorpay may process payment data and confirmations.
        </p>
      </div>
      <div className="public-section">
        <h2>Community content</h2>
        <p>
          Public posts shared by users may be visible to other users inside the
          platform. The platform may moderate or remove content that violates
          community standards.
        </p>
      </div>
      <div className="public-section">
        <h2>Support contact</h2>
        <p>
          For service issues or policy questions, contact{" "}
          {settings.CONTACT_NAME ? settings.CONTACT_NAME : "Not configured yet"}
          {settings.CONTACT_EMAIL ? ` at ${settings.CONTACT_EMAIL}.` : "."}
        </p>
      </div>
    </PublicLayout>
  );
}

export function ContactPage() {
  const settings = usePublicSettings();
  const whatsappNumber = String(settings.CONTACT_WHATSAPP || "").replace(
    /[^0-9]/g,
    "",
  );

  return (
    <PublicLayout
      title="Contact"
      subtitle="This public contact page can be shared in Google OAuth and Razorpay approval forms. Contact details can be updated from the Admin settings UI."
    >
      <div className="contact-grid">
        <div className="contact-item">
          <p className="contact-label">Name</p>
          <p className="contact-value">
            {settings.CONTACT_NAME || "Not configured yet"}
          </p>
        </div>
        <div className="contact-item">
          <p className="contact-label">Email</p>
          <p className="contact-value">
            {settings.CONTACT_EMAIL ? (
              <a href={`mailto:${settings.CONTACT_EMAIL}`}>
                {settings.CONTACT_EMAIL}
              </a>
            ) : (
              "Not configured yet"
            )}
          </p>
        </div>
        <div className="contact-item">
          <p className="contact-label">Phone</p>
          <p className="contact-value">
            {settings.CONTACT_PHONE ? (
              <a href={`tel:${settings.CONTACT_PHONE}`}>
                {settings.CONTACT_PHONE}
              </a>
            ) : (
              "Not configured yet"
            )}
          </p>
        </div>
        <div className="contact-item">
          <p className="contact-label">WhatsApp</p>
          <p className="contact-value">
            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                {settings.CONTACT_WHATSAPP}
              </a>
            ) : (
              "Not configured yet"
            )}
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
