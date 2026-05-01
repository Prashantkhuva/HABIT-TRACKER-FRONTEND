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
        headers: { Accept: "application/json" },
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
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 px-4 sm:px-6 lg:px-10 py-8 text-[#1A1A1A] dark:text-[#E6E1E5]">
      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between gap-10">
        <div>
          <h1
            className="text-[clamp(2.5rem,8vw,80px)] font-bold leading-[0.9]"
            style={{ fontFamily: "Epilogue, sans-serif" }}
          >
            need <br /> help?
          </h1>

          <p className="mt-4 text-[#888888] dark:text-[#938F99] max-w-sm">
            feel free to reach out anytime. our rhythm matches yours.
          </p>

          {/* CONTACT */}
          <div className="mt-10 space-y-4">
            {/* EMAIL */}
            <a
              href="mailto:work.prashantkhuva@gmail.com"
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#2A2A2A] hover:scale-[1.02] transition-all"
            >
              <div className="w-10 h-10 bg-[#F3F3F3] dark:bg-black rounded-full flex items-center justify-center">
                <Mail
                  size={18}
                  className="text-[#1A1A1A] dark:text-[#E6E1E5]"
                />
              </div>
              <div>
                <p className="text-xs tracking-widest text-[#888888] dark:text-[#938F99] uppercase">
                  EMAIL
                </p>
                <p className="font-medium">work.prashantkhuva@gmail.com</p>
              </div>
            </a>

            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/prashantkhuva"
              target="_blank"
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#2A2A2A] hover:scale-[1.02] transition-all"
            >
              <div className="w-10 h-10 bg-[#F3F3F3] dark:bg-black rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#1A1A1A] dark:text-[#E6E1E5]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-widest text-[#888888] dark:text-[#938F99]">
                  LINKEDIN
                </p>
                <p className="font-medium">prashantkhuva</p>
              </div>
            </a>

            {/* X */}
            <a
              href="https://x.com/prashantkhuva_"
              target="_blank"
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#2A2A2A] hover:scale-[1.02] transition-all"
            >
              <div className="w-10 h-10 bg-[#F3F3F3] dark:bg-black rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#1A1A1A] dark:text-[#E6E1E5]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-widest text-[#888888] dark:text-[#938F99]">
                  X / TWITTER
                </p>
                <p className="font-medium">@prashantkhuva_</p>
              </div>
            </a>
          </div>
        </div>

        {/* IMAGE */}
        <img
          src="/help.png"
          alt="help"
          className="rounded-3xl w-full object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div
        className="
          w-full lg:w-1/2
          bg-[#FAFAF5] dark:bg-black
          p-5 sm:p-6 lg:p-8
          rounded-3xl
        
        "
      >
        <h2
          className="text-xl sm:text-2xl font-semibold mb-6"
          style={{ fontFamily: "Epilogue, sans-serif" }}
        >
          direct message
        </h2>

        {success && (
          <p className="mb-4 text-sm text-[#48645E] dark:text-[#CDC0E9]">
            ✅ Message sent successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <Input
            name="name"
            label="Full Name"
            required
            className="dark:bg-black"
          />
          <Input
            name="email"
            type="email"
            label="Email Address"
            required
            className="dark:bg-black"
          />
          <Textarea name="message" rows={5} label="Your Message" required />

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Sending..." : "SEND MESSAGE"}
          </Button>
        </form>

        <p className="text-xs mt-6 text-right text-[#888888] dark:text-[#938F99]">
          usually responds within 2 hours
        </p>
      </div>
    </div>
  );
}
