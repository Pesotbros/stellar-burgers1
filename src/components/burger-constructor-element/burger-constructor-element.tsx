import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngredient,
  removeIngredient
} from '../../services/burgerConstructor/slice';
import { useDispatch } from '../../services/store';

/**
 * Компонент элемента конструктора бургера с возможностью перемещения и удаления
 * Отображает отдельный ингредиент в сборке бургера и предоставляет интерфейс
 * для изменения его позиции или удаления из конструкции
 */
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    /**
     * Обработчик перемещения ингредиента вниз по списку
     * Проверяет, что элемент не находится на последней позиции,
     * затем отправляет действие на изменение порядка ингредиентов
     */
    const handleMoveDown = () => {
      // Блокировка перемещения, если элемент уже находится в конце списка
      if (index === totalItems - 1) return;

      dispatch(
        moveIngredient({
          from: index,
          to: index + 1
        })
      );
    };

    /**
     * Обработчик перемещения ингредиента вверх по списку
     * Проверяет, что элемент не находится на первой позиции,
     * затем отправляет действие на изменение порядка ингредиентов
     */
    const handleMoveUp = () => {
      // Блокировка перемещения, если элемент уже находится в начале списка
      if (index === 0) return;

      dispatch(
        moveIngredient({
          from: index,
          to: index - 1
        })
      );
    };

    /**
     * Обработчик удаления ингредиента из сборки бургера
     * Отправляет действие на удаление ингредиента по его уникальному идентификатору
     */
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    // Формирование пропсов для UI‑компонента с обработчиками событий
    const uiComponentProps = {
      ingredient,
      index,
      totalItems,
      handleMoveUp,
      handleMoveDown,
      handleClose
    };

    return (
      <div className='burger-constructor-element-wrapper'>
        <BurgerConstructorElementUI {...uiComponentProps} />
      </div>
    );
  }
);
