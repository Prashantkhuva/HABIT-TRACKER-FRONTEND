import Signin from "../components/Signin";
import { motion } from "framer-motion";

function Signinpage() {
  return (
    <motion.div
      className="min-h-[85vh] items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Signin />
    </motion.div>
  );
}

export default Signinpage;
