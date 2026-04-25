import React, { FC, memo } from 'react';
import styles from './burger-constructor-element.module.css';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import { BurgerConstructorElementUIProps } from './type';
import { MoveButton } from '@zlden/react-developer-burger-ui-components';

/**
 * Компонент элемента конструктора бургера
 * Отображает отдельный ингредиент в конструкторе с кнопками перемещения и удаления
 * @param props — пропсы компонента:
 * - ingredient: данные ингредиента
 * - index: позиция ингредиента в списке
 * - totalItems: общее количество ингредиентов в списке
 * - handleMoveUp: обработчик перемещения вверх
 * - handleMoveDown: обработчик перемещения вниз
 * - handleClose: обработчик удаления ингредиента
 * @returns JSX элемент ингредиента конструктора
 */
export const BurgerConstructorElementUI: FC<BurgerConstructorElementUIProps> =
  memo(
    ({
      ingredient,
      index,
      totalItems,
      handleMoveUp,
      handleMoveDown,
      handleClose
    }) => {
      // Определяем, можно ли перемещать элемент вверх (не первый в списке)
      const canMoveUp = index > 0;
      // Определяем, можно ли перемещать элемент вниз (не последний в списке)
      const canMoveDown = index < totalItems - 1;

      return (
        <li
          className={`${styles.element} mb-4 mr-2`}
          data-cy={`constructor-ingredient-${ingredient._id}`}
          aria-label={`Ингредиент: ${ingredient.name}`}
          role='listitem'
        >
          <MoveButton
            handleMoveDown={handleMoveDown}
            handleMoveUp={handleMoveUp}
            isUpDisabled={!canMoveUp}
            isDownDisabled={!canMoveDown}
          />
          <div className={`${styles.element_fullwidth} ml-2`}>
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
              handleClose={handleClose}
            />
          </div>
        </li>
      );
    }
  );
