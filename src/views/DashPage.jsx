import { Dashboard } from "../components/index";
import { motion } from "framer-motion";

function DashPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Dashboard />
    </motion.div>
  );
}

export default DashPage;
