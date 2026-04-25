import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

/**
 * Компонент конструктора бургера
 * Отображает интерфейс сборки бургера с возможностью оформления заказа
 * @param props — пропсы компонента
 * @returns JSX элемент конструктора бургера
 */
export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => {
  // Проверяем, есть ли булка в конструкторе (верх и низ)
  const hasBun = !!constructorItems.bun;
  // Проверяем, есть ли начинки в конструкторе
  const hasIngredients = constructorItems.ingredients.length > 0;

  return (
    <section className={styles.burger_constructor} data-cy='burger-constructor'>
      {constructorItems.bun ? (
        <div
          className={`${styles.element} mb-4 mr-4`}
          data-cy='constructor-bun-top'
        >
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      {/* Список ингредиентов — отображается, если есть начинки */}
      <ul className={styles.elements} data-cy='constructor-ingredients'>
        {hasIngredients ? (
          constructorItems.ingredients.map(
            (item: TConstructorIngredient, index: number) => (
              <BurgerConstructorElement
                ingredient={item}
                index={index}
                totalItems={constructorItems.ingredients.length}
                key={item.id}
              />
            )
          )
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          >
            Выберите начинку
          </div>
        )}
      </ul>
      {constructorItems.bun ? (
        <div
          className={`${styles.element} mb-4 mr-4`}
          data-cy='constructor-bun-bottom'
        >
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      {/* Блок с ценой и кнопкой оформления заказа */}
      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <div data-cy='order-button'>
          <Button
            htmlType='button'
            type='primary'
            size='large'
            children='Оформить заказ'
            onClick={onOrderClick}
            disabled={!hasBun || !hasIngredients} // Кнопка неактивна, если нет булки или начинок
            data-cy='order-submit-button'
          />
        </div>
      </div>

      {/* Модальное окно с прелоадером во время отправки заказа */}
      {orderRequest && (
        <Modal onClose={closeOrderModal} title='Оформляем заказ...'>
          <Preloader />
        </Modal>
      )}

      {/* Модальное окно с деталями заказа после успешного создания */}
      {orderModalData && (
        <Modal
          onClose={closeOrderModal}
          title={orderRequest ? 'Оформляем заказ...' : ''}
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
