import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

/**
 * Компонент карточки ингредиента бургера
 * Отображает карточку ингредиента с изображением, ценой, названием и кнопкой добавления
 * @param props — пропсы компонента:
 * - ingredient: данные ингредиента (изображение, цена, название, ID)
 * - count: количество данного ингредиента в конструкторе (опционально)
 * - handleAdd: обработчик нажатия кнопки добавления ингредиента
 * - locationState: состояние для передачи в роутер при переходе на страницу ингредиента
 * @returns JSX элемент карточки ингредиента
 */
export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { image, price, name, _id } = ingredient;

    // Формируем alt‑текст для изображения с учётом названия ингредиента
    const imageAltText = `Изображение ингредиента: ${name}`;

    return (
      <li
        className={styles.container}
        data-cy={`ingredient-card-${_id}`}
        aria-label={`Ингредиент: ${name}`}
        role='listitem'
      >
        <Link
          data-cy={`ingredient-link-${_id}`}
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
          aria-label={`Подробнее о ${name}`}
        >
          {/* Отображаем счётчик, если ингредиент уже добавлен в конструктор */}
          {count && <Counter count={count} />}

          <img
            className={styles.img}
            src={image}
            alt={imageAltText}
            loading='lazy' // Ленивая загрузка изображений
          />

          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>

          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>

        {/* Блок с кнопкой добавления ингредиента */}
        <div data-cy={`ingredient-add-${_id}`}>
          <AddButton
            text='Добавить'
            onClick={handleAdd}
            extraClass={`${styles.addButton} mt-8`}
            aria-label={`Добавить ${name} в конструктор бургера`}
          />
        </div>
      </li>
    );
  }
);
