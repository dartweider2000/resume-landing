import { isMobile, slideUP } from './functions.js';
export { burgerMenu };
/*
Бургер:
Это span и в нём создаются два превдоэлемента before и after. Бургеру всегда имеет аттрибут data-burger="(min\max), number".
1-ый аргумент показывает каким будет медиа запрос min-width или max-width. 2-ой аргумент задаёт ширину, на которой будет действовать
медиа запрос. При клике на бургер ему задаётся класс _active. Имеются заготовленные CSS стили
Меню боду:
Это та часть мею, которая выезжает из за границ экрана. Всегда имеет аттрибут data-burger-menu-body. Автоматически задаётся overflow: auto,
чтобы была прокрутка.При килике на бургер, меню боди получает класс _active. Имеются заготовленные стили.
Боди:
Тело сайта. При клике на Бургер получает класс _burger-lock, который задаёт overflow: hidden, чтобы не было лишнего скрола.
*/
const burgerMenu = () => {
   //Если бургера нет, то выходим из функции
   if(!document.querySelector('[data-burger]'))
      return;
   //Получаю бургер
   const burger = document.querySelector('[data-burger]');
   //Получаю массив с аргументами, которые были переданы через data-burger
   const dataset = burger.dataset.burger.split(',').map(el => el.trim());
   //Создаю медиа запрос
   const mediaQuery = `(${dataset[0]}-width: ${dataset[1]}px)`;
   //Создаю matchMedia
   const matchMedia = window.matchMedia(mediaQuery);
   //Получаю меню боди
   const menuBody = document.querySelector('[data-burger-menu-body]');

   /*
   Дополнение на случай если нужно будет выпадающее меню. Данное условие нужно, чтобы открывать меню на touch screen устройствах,
   на такой ширине экрана, на которой ещё нет меню burger. Уже в меню burger выпадающее меню будет реализовываться за счёт спойлеров
   */
   //Проверяю есть ли внутри menuBody спойлеры, а так же проверяю на мобилке ли открыта страничка
   if(menuBody.querySelector('[data-spoilers]') && isMobile.any()){
      //Получаю массив элементов li(.menu-header__item|sub-item...). Получаю именно их потому, что клик пользователя происходит
      //именно по этому элементу, а не по data-spoiler-title
      const spoilers = Array.from(document.querySelectorAll('[data-burger-menu-body] [data-spoiler-span]')).map(el => el.closest('li'));
      //Создаю mediaQuery
      const mediaQuery = `(${dataset[0]}-width: ${dataset[1]}px) and (hover: none)`;
      //создаю matchMedia
      const matchMedia = window.matchMedia(mediaQuery);
      //Добавляю элемнтам li обработчик события touch
      spoilers.forEach(spoiler => spoiler.addEventListener('click', e => {
         if(isMobile.any() && burger.classList.contains('_hidden')){
            //Останавливаю всплытие события, чтобы если меню вложено, то до верхних разделов не доходило событие
            e.stopPropagation();
            //Добавляю или отнимаю класс _opne
            spoiler.classList.toggle('_open');

            //Если закрывается меню родитель, то и все дочерние меню тоже закрываются
            if(!spoiler.classList.contains('_open')){
               Array.from(spoiler.querySelectorAll('[data-spoiler-body]>._open')).forEach(el => el.classList.remove('_open'));
            }
         }
      }));

      //Функция, котора закрывает все такие touch menu в случае необходимости 
      const closeMenu = () => spoilers.forEach(spoiler => spoiler.classList.remove('_open'));
      //Обработчик события change, который закрывает меню всегда когда происходит пересечение определённой отметки ширины экрана.
      const listener = e => closeMenu();

      //Вызываю обработчик
      listener();
      //Задаю обработчик
      matchMedia.addEventListener('change', listener);
   }

   //Функция нужна для того, чтобы закрывать все открытые спойлеры, когда меню бургер закрывается.
   const closeSpoilers = () => {
      //Проверяю закрыто меню burger или нет
      if(!burger.classList.contains('_active') && menuBody.querySelector('[data-spoilers]')){
         //Получаю titles - массив всех открытых data-spoiler-title
         const titles = Array.from(menuBody.querySelectorAll('[data-spoiler-title]._active'));
         //Закрываю все данные спойлеры
         titles.forEach(title => {
            title.classList.remove('_active');
            slideUP(title.nextElementSibling);
         });
      }
   }

   //Функция нужна для того, чтобы закрывать меню burder и удалять ненужные класссы, когда это нужно
   const closeBurger = () => {
      burger.classList.remove('_active');
      menuBody.classList.remove('_active');
      document.body.classList.remove('_burger-lock');
   }
   
   //Создаю обработчик события change для matchMedia, который будет действовать в случае достижения установленной ширины экрана.
   const listener = e => {
      if(matchMedia.matches){
         //По достижении нужной ширины показываю бургер
         burger.classList.remove('_hidden');
      }else{
         //Скрываю бургер
         burger.classList.add('_hidden');
      }

      //Может быть ситуация, по которой произошло изменение ширины экрана, во время работы бургера, и на той ширине, на которую
      //переключились, там уже нет бургера. И для предотвращения эксессов, я убираюданные классы у элементов.
      closeBurger();
      closeSpoilers();
   }

   //Прописываю обработчик клика для бургера.
   burger.addEventListener('click', e => {
      burger.classList.toggle('_active');
      menuBody.classList.toggle('_active');
      document.body.classList.toggle('_burger-lock');

      closeSpoilers();
      //Делаю для меню боди скролл вверх. Это полезна в тех случаях, когда проматал меню вниз и вышел из бургера.Если не прописывать
      //скролл вверх, то при повторном заходе в бургер скролл будет внизу, что не очень удобно.
      if(menuBody.classList.contains('_active')){
         menuBody.scrollTo(0, 0);
      }
   });

   //Вызываю обработчик медиа запроса.
   listener();
   //Добавляю обработчик события.
   matchMedia.addEventListener('change', listener);

   const clickScrollLinkHandler = e => {
      const el = e.target;

      if(!el.closest('[data-scroll]'))
         return;

      closeBurger();
      closeSpoilers();
   };

   if(document.body.classList.contains('_touch')){
      document.addEventListener('touchstart', clickScrollLinkHandler);
   }else{
      document.addEventListener('click', clickScrollLinkHandler);
   }
}