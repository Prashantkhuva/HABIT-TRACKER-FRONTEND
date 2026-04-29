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
    <div className="min-h-screen px-12 py-10 bg-[#FAFAF5] flex gap-16">
      {/* LEFT */}
      <div className="w-1/2 flex flex-col justify-between">
        <div>
          <h1
            className="text-[80px] font-bold leading-[0.9]"
            style={{ fontFamily: "Epilogue, sans-serif" }}
          >
            need <br /> help?
          </h1>

          <p className="text-gray-500 mt-4 max-w-sm">
            feel free to reach out anytime. our rhythm matches yours.
          </p>

          {/* CONTACT CARDS */}
          <div className="mt-10 space-y-5">
            {/* EMAIL */}
            <a
              href="mailto:work.prashantkhuva@gmail.com"
              className="flex items-center gap-4 p-5 rounded-[20px] bg-[#F0EDE5] hover:scale-[1.02] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 tracking-widest">EMAIL</p>
                <p className="font-medium">work.prashantkhuva@gmail.com</p>
              </div>
            </a>

            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/prashantkhuva"
              target="_blank"
              className="flex items-center gap-4 p-5 rounded-[20px] bg-[#F0EDE5] hover:scale-[1.02] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src="/linkedin.svg" alt="linkedin" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 tracking-widest">
                  LINKEDIN
                </p>
                <p className="font-medium">prashantkhuva</p>
              </div>
            </a>

            {/* X */}
            <a
              href="https://x.com/prashantkhuva_"
              target="_blank"
              className="flex items-center gap-4 p-5 rounded-[20px] bg-[#F0EDE5] hover:scale-[1.02] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src="/twitter.svg" alt="twitter" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 tracking-widest">
                  X / TWITTER
                </p>
                <p className="font-medium">@prashantkhuva_</p>
              </div>
            </a>
          </div>
        </div>

        {/* IMAGE */}
        <div className="mt-10">
          <img
            src="/help.png"
            alt="help"
            className="rounded-[28px] w-full object-cover"
          />
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="w-1/2 bg-[#FFFFFF] p-10 rounded-4xl h-fit self-start">
        <h2 className="text-2xl mb-8">direct message</h2>

        {/* SUCCESS MESSAGE */}
        {success && (
          <p className="mb-4 text-green-600 text-sm">
            ✅ Message sent successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="name"
            label="Full Name"
            placeholder="Enter your name"
            required
            className="bg-[#F0EDE5]"
          />

          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            required
            className="bg-[#F0EDE5]"
          />

          <Textarea
            name="message"
            label="Your Message"
            rows={5}
            placeholder="Tell us what's on your mind..."
            required
            className="bg-[#F0EDE5] "
          />

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Sending..." : "SEND MESSAGE"}
          </Button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-right">
          usually responds within 2 hours
        </p>
      </div>
    </div>
  );
}
