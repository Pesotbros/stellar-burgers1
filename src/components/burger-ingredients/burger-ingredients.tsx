import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import {
  selectBuns,
  selectMains,
  selectSauces
} from '../../services/burgerIngredients/slice';

/**
 * Компонент отображения ингредиентов для конструктора бургера
 * Реализует интерфейс с вкладками (булочки, начинки, соусы) и
 * автоматическую смену активной вкладки при прокрутке страницы
 */
export const BurgerIngredients: FC = () => {
  const buns = useSelector(selectBuns);
  const mains = useSelector(selectMains);
  const sauces = useSelector(selectSauces);

  // Состояние текущей активной вкладки (по умолчанию — булочки)
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Рефы для заголовков разделов — используются для прокрутки к нужному разделу
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Рефы и флаги видимости для отслеживания видимости разделов при прокрутке
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  /**
   * Эффект отслеживания видимости разделов
   * Автоматически меняет активную вкладку в зависимости от того,
   * какой раздел сейчас виден в области просмотра
   */
  useEffect(() => {
    // Приоритет видимости: булочки → соусы → начинки
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  /**
   * Обработчик клика по вкладке
   * Меняет активную вкладку и прокручивает страницу к соответствующему разделу
   * @param tab - идентификатор вкладки ('bun', 'main', 'sauce')
   */
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);

    // Прокрутка к нужному разделу с плавным анимационным эффектом
    switch (tab) {
      case 'bun':
        titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'main':
        titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'sauce':
        titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  // Формирование пропсов для UI‑компонента
  const uiComponentProps = {
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  };

  return (
    <div className='burger-ingredients-wrapper'>
      <BurgerIngredientsUI {...uiComponentProps} />
    </div>
  );
};
