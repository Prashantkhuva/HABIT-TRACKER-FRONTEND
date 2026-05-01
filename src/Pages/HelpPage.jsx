import { useState } from "react";
import { Mail } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";

export default function HelpPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    setLoading(true);

    try {
      const res = await fetch("https://formspree.io/f/mjgjqnqd", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setSuccess(true);
        form.reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8 lg:gap-16 flex-col lg:flex-row text-text-primary">
      {/* LEFT */}
      <div className="lg:w-1/2 flex flex-col justify-between gap-8">
        <div>
          <h1
            className="text-[clamp(3rem,8vw,80px)] font-bold leading-[0.9] text-text-primary dark:text-white"
            style={{ fontFamily: "Epilogue, sans-serif" }}
          >
            need <br /> help?
          </h1>

          <p className="text-text-muted mt-4 max-w-sm">
            feel free to reach out anytime. our rhythm matches yours.
          </p>

          {/* CONTACT CARDS */}
          <div className="mt-10 space-y-4">
            {/* EMAIL */}
            <a
              href="mailto:work.prashantkhuva@gmail.com"
              className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#1D1B20]  hover:scale-[1.02] transition-all duration-200"
            >
              <div className="w-10 h-10 bg-surface-dim dark:bg-black rounded-full flex items-center justify-center">
                <Mail size={18} className="text-primary dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-text-muted tracking-widest uppercase">
                  EMAIL
                </p>
                <p className="font-medium text-text-primary dark:text-white">
                  work.prashantkhuva@gmail.com
                </p>
              </div>
            </a>

            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/prashantkhuva"
              target="_blank"
              className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#1D1B20]  hover:scale-[1.02] transition-all duration-200"
            >
              <div className="w-10 h-10 bg-surface-dim dark:bg-black rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  className="text-black dark:text-white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-text-muted tracking-widest">
                  LINKEDIN
                </p>
                <p className="font-medium text-text-primary dark:text-white">
                  prashantkhuva
                </p>
              </div>
            </a>

            {/* X */}
            <a
              href="https://x.com/prashantkhuva_"
              target="_blank"
              className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#1D1B20] hover:scale-[1.02] transition-all duration-200"
            >
              <div className="w-10 h-10 bg-surface-dim dark:bg-black rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#1A1A1A] dark:text-[#E6E1E5]"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    fill="none"
                    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-text-muted tracking-widest">
                  X / TWITTER
                </p>
                <p className="font-medium text-text-primary dark:text-white">
                  @prashantkhuva_
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <img
            src="/help.png"
            alt="help"
            className="rounded-3xl w-full object-cover"
          />
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="lg:w-1/2 bg-white dark:bg-black p-8 rounded-3xl h-fit self-start">
        <h2
          className="text-2xl font-semibold mb-8 text-text-primary dark:text-white"
          style={{ fontFamily: "Epilogue, sans-serif" }}
        >
          direct message
        </h2>

        {/* SUCCESS MESSAGE */}
        {success && (
          <p className="mb-4 text-primary dark:text-dark-primary text-sm">
            ✅ Message sent successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="name"
            label="Full Name"
            placeholder="Enter your name"
            required
            className="dark:bg-black"
          />

          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            required
            className="dark:bg-black"
          />

          <Textarea
            name="message"
            label="Your Message"
            rows={5}
            placeholder="Tell us what's on your mind..."
            required
          />

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Sending..." : "SEND MESSAGE"}
          </Button>
        </form>

        <p className="text-xs text-text-muted mt-6 text-right">
          usually responds within 2 hours
        </p>
      </div>
    </div>
  );
}
