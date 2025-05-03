import { useAuth } from "../../../context/AuthContext";

const ThemeWrapper = ({ children }) => {
  const { isNormal } = useAuth();
  
  return (
    <div className={isNormal() ? 'theme-normal' : 'theme-professional'}>
      {children}
    </div>
  );
};

export default ThemeWrapper;