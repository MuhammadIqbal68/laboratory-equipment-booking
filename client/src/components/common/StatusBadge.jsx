import { getStatusColor } from '../../utils/helpers';

const StatusBadge = ({ status }) => {
  return (
    <span className={`badge badge--${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
