import { useAuth } from "../../../context/AuthContext";

const ThemeWrapper = ({ children }) => {
  const { isPatient } = useAuth();
  
  return (
    <div className={isPatient() ? 'theme-patient' : 'theme-professional'}>
      {children}
    </div>
  );
};

export default ThemeWrapper;