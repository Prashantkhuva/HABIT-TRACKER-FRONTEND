import Signup from "../components/Signup";
import { motion } from "framer-motion";

function Signuppage() {
  return (
    <motion.div
      className="min-h-screen items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Signup />
    </motion.div>
  );
}

export default Signuppage;
