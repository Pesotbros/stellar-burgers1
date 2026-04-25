describe('constructor page', () => {
  beforeEach(() => {
    // Мокируем запросы к API:
    //  получение списка ингредиентов
    //  данные пользователя
    //  лента заказов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('GET', '**/api/orders/all', {
      body: {
        success: true,
        orders: [],
        total: 0,
        totalToday: 0
      }
    }).as('getFeed');

    // Переходим на главную страницу и ждём загрузки данных
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  // Очистка токенов и состояния после каждого теста
  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('добавление булки и начинок в конструктор', () => {
    // Добавляем ингредиенты в конструктор: булку, начинку и соус
    cy.get('[data-cy="ingredient-add-bun-1"]').contains('Добавить').click();
    cy.get('[data-cy="ingredient-add-main-1"]').contains('Добавить').click();
    cy.get('[data-cy="ingredient-add-sauce-1"]').contains('Добавить').click();

    // Проверяем отображение булки в верхней и нижней части бургера
    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3'
    );

    // Проверяем отображение начинки и соуса в конструкторе
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain.text',
      'Соус Spicy-X'
    );
  });

  it('открытие и закрытие модального окна ингредиента', () => {
    // Открываем модальное окно для начинки
    cy.get('[data-cy="ingredient-link-main-1"]').click();

    // Проверяем, что модальное окно открыто и отображает корректную информацию
    cy.get('[data-cy="modal"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Детали ингредиента').should('be.visible');
        cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      });

    // Закрываем модальное окно кнопкой и проверяем, что оно исчезло
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Повторно открываем модальное окно для соуса
    cy.get('[data-cy="ingredient-link-sauce-1"]').click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрываем модальное окно кликом по оверлею и проверяем, что оно исчезло
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создание заказа, закрытие модального окна и очистка конструктора', () => {
    // Устанавливаем токены авторизации для теста
    cy.setCookie('accessToken', 'Bearer mockAccessToken');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mockRefreshToken');
    });

    // Мокируем запрос на создание заказа
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.get('[data-cy="ingredient-add-bun-1"]').contains('Добавить').click();
    cy.get('[data-cy="ingredient-add-main-1"]').contains('Добавить').click();
    cy.get('[data-cy="ingredient-add-sauce-1"]').contains('Добавить').click();

    cy.get('[data-cy="order-button"]').contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="order-number"]').should('contain.text', '12345');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор очищен после успешного заказа
    cy.contains('Выберите булки').should('have.length.at.least', 1);
    cy.contains('Выберите начинку').should('be.visible');
    cy.get('[data-cy="constructor-ingredients"]').should(
      'not.contain.text',
      'Биокотлета'
    );
    cy.get('[data-cy="constructor-ingredients"]').should(
      'not.contain.text',
      'Соус Spicy-X'
    );
  });
});
