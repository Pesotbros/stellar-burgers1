import { TOrder } from '@utils-types';
import { BurgerConstructorState } from 'src/services/burgerConstructor/slice';

export type BurgerConstructorUIProps = {
  constructorItems: BurgerConstructorState;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
