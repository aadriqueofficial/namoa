import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FadeUp } from "@/components/site/Reveal";
import { CONTACT, COMPANY_PROFILE_URL } from "@/data/content";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

const EMPTY = {
  name: "",
  company: "",
  email: "",
  phone: "",
  enquiry_type: "",
  message: "",
  website: "",
};

const INPUT =
  "w-full bg-white border border-[#0B2742]/15 px-4 py-3.5 text-[14.5px] text-[#0B2742] placeholder:text-[#687583]/60 outline-none focus:border-[#C8A44D] transition-colors duration-300 disabled:opacity-60";

/* A labelled form control, in the same mono-label voice as the company cards. */
const Field = ({ label, required = false, className = "", children }) => (
  <label className={`block ${className}`}>
    <span className="block font-mono-brand text-[9px] tracking-[0.25em] text-[#687583] mb-2.5">
      {label}
      {required && <span className="text-[#C8A44D]"> *</span>}
    </span>
    {children}
  </label>
);

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const sending = status === "sending";

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    let res;
    try {
      res = await fetch(`${API}/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      setError("We couldn't reach NAMOA. Check your connection and try again.");
      setStatus("error");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      // FastAPI returns a string for our own errors and a list for field validation.
      setError(
        typeof data.detail === "string" ? data.detail : "Please check your details and try again."
      );
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  return (
    <div data-testid="contact-page" className="bg-white">
      <Navbar />

      <section className="pt-40 pb-20 md:pb-28 bg-[#F7F8FA] border-b border-[#0B2742]/8">
        <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <FadeUp>
            <Link
              to="/#contact"
              data-testid="contact-page-back"
              className="inline-flex items-center gap-2.5 font-mono-brand text-[10px] tracking-[0.25em] text-[#687583] hover:text-[#C8A44D] transition-colors mb-10"
            >
              <ArrowLeft size={13} /> HOME
            </Link>
            <div className="eyebrow mb-5">ENQUIRY FORM</div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] uppercase tracking-tight leading-[1.05]">
              Let's Build
              <br />
              Something Together.
            </h1>
            <p className="text-[#687583] leading-relaxed mt-6 max-w-xl">
              Tell us what you're looking for — sourcing, procurement, logistics, project support or
              a partnership — and the NAMOA team will get back to you.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            <FadeUp>
              {status === "sent" ? (
                <div
                  data-testid="enquiry-success"
                  className="border border-[#C8A44D]/50 bg-[#F5EEDB]/60 p-8 md:p-11"
                >
                  <div className="w-11 h-11 rounded-full border border-[#C8A44D] bg-white flex items-center justify-center">
                    <Check className="text-[#C8A44D]" size={20} />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#0B2742] uppercase tracking-tight mt-6">
                    Enquiry Received.
                  </h2>
                  <p className="text-[#687583] leading-relaxed mt-4 max-w-md">
                    Thank you, {form.name}. Your enquiry is with the NAMOA team — a confirmation is
                    on its way to{" "}
                    <span className="font-semibold text-[#0B2742] break-all">{form.email}</span>, and
                    we'll reply there.
                  </p>
                  <button
                    type="button"
                    data-testid="enquiry-reset"
                    onClick={() => {
                      setForm(EMPTY);
                      setStatus("idle");
                    }}
                    className="btn-ghost mt-8"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  data-testid="enquiry-form"
                  className="grid sm:grid-cols-2 gap-x-6 gap-y-7"
                >
                  <Field label="FULL NAME" required>
                    <input
                      name="name"
                      value={form.name}
                      onChange={update}
                      required
                      maxLength={120}
                      autoComplete="name"
                      disabled={sending}
                      data-testid="enquiry-name"
                      className={INPUT}
                    />
                  </Field>
                  <Field label="COMPANY">
                    <input
                      name="company"
                      value={form.company}
                      onChange={update}
                      maxLength={160}
                      autoComplete="organization"
                      disabled={sending}
                      data-testid="enquiry-company"
                      className={INPUT}
                    />
                  </Field>
                  <Field label="EMAIL" required>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={update}
                      required
                      maxLength={254}
                      autoComplete="email"
                      disabled={sending}
                      data-testid="enquiry-email"
                      className={INPUT}
                    />
                  </Field>
                  <Field label="PHONE">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={update}
                      maxLength={40}
                      autoComplete="tel"
                      disabled={sending}
                      data-testid="enquiry-phone"
                      className={INPUT}
                    />
                  </Field>
                  <Field label="ENQUIRY TYPE" required className="sm:col-span-2">
                    <span className="relative block">
                      <select
                        name="enquiry_type"
                        value={form.enquiry_type}
                        onChange={update}
                        required
                        disabled={sending}
                        data-testid="enquiry-type"
                        className={`${INPUT} appearance-none pr-11`}
                      >
                        <option value="" disabled>
                          Select an enquiry type
                        </option>
                        {CONTACT.enquiries.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#687583] pointer-events-none"
                        size={16}
                      />
                    </span>
                  </Field>
                  <Field label="MESSAGE" required className="sm:col-span-2">
                    {/* data-lenis-prevent lets the textarea scroll natively under smooth scroll. */}
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={update}
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={6}
                      placeholder="Tell us about your requirement, timeline and location."
                      disabled={sending}
                      data-lenis-prevent
                      data-testid="enquiry-message"
                      className={`${INPUT} resize-y min-h-[160px]`}
                    />
                  </Field>

                  {/* Honeypot: off-screen and out of the tab order, so only bots fill it in. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    <label>
                      Website
                      <input
                        name="website"
                        value={form.website}
                        onChange={update}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      data-testid="enquiry-submit"
                      className="btn-navy disabled:opacity-60 disabled:pointer-events-none"
                    >
                      {sending ? "Sending…" : "Send Enquiry"}
                      {!sending && <ArrowRight size={15} />}
                    </button>
                    {status === "error" && (
                      <p
                        role="alert"
                        data-testid="enquiry-error"
                        className="text-[13.5px] font-semibold text-[#B42318]"
                      >
                        {error}
                      </p>
                    )}
                  </div>
                </form>
              )}
            </FadeUp>
          </div>

          <div className="lg:col-span-5">
            <FadeUp delay={0.12}>
              <div className="bg-[#081D30] text-white p-8 md:p-10">
                <div className="font-mono-brand text-[10px] tracking-[0.3em] text-[#C8A44D] mb-7">
                  REGISTERED OFFICE
                </div>
                <address className="not-italic text-[15px] text-white/80 leading-loose">
                  {CONTACT.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <div className="border-t border-white/10 mt-8 pt-8">
                  <div className="font-mono-brand text-[10px] tracking-[0.3em] text-[#C8A44D] mb-4">
                    COMPANY PROFILE
                  </div>
                  <a
                    href={COMPANY_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-white font-bold text-sm hover:text-[#C8A44D] transition-colors"
                  >
                    Download Company Profile <ArrowDown size={15} />
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
