import { InstituteProfileModal } from '../../../components/modals/InstituteProfileModal';
import { useNavigate } from 'react-router-dom';

export const InstituteProfile = () => {
  const navigate = useNavigate();
  return <InstituteProfileModal onClose={() => navigate('/dashboard')} />;
};

export default InstituteProfile;
