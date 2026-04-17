import { useParams } from 'react-router-dom';
import { Modal } from './modal';
import { OrderInfo } from '../order-info';

export const FeedOrderModalRoute = ({ onClose }: { onClose: () => void }) => {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal title={number ? `#${number}` : ''} onClose={onClose}>
      <OrderInfo hideNumber />
    </Modal>
  );
};
