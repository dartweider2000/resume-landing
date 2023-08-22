import {  slideUP } from './functions.js';
export { popup }
/*
Popup:
Блок, которыому всегда задан класс popup. Имеет в своём составе всегда блоки popup__body, popup__content, popup__close. Так же сам блок
снабжается модификатором popup_(something), чтобы можно было точно определить к какому попапу идёт обращение. У блоков есть специальные, 
заранее заданные стили в CSS.
Link:
Ссылка, при нажатии на которую будет показываться попап. Всегда обладает атттрибутом data-popup-link. Данный аттрибут всегда принимает
как аргумент название класса попапа, который нужно расскрыть. Именно название, то есть без точки. Важно, что на один попап может вести 
сразу несколько ссылок
FixedPadding:
Элементам, которым задан position: fixed нужно задать аттрибут data-popup-fixed-pidding, чтоже они визульно не дёргались во время открытия попапа.
*/
const popup = () => {
   //Если таких элементов нет, то не выполняю
   if(!document.querySelectorAll('.popup').length)
      return;
   //Получаю массив всех попапов, которые есть в документе.
   const popups = Array.from(document.querySelectorAll('.popup'));
   //Получаю массив всех ссылок, при нажатии на которые будут открываться попапы
   const popupLinks = Array.from(document.querySelectorAll('[data-popup-link]'));
   //Получаю массив всех fixed элементов, которым нужно успановить паддинг
   const popupFixedPaddingElems = Array.from(document.querySelectorAll('[data-popup-fixed-padding]'));
   //Прогоняю массив попапов
   popups.forEach((popup, index) => {
      //Получаю массив ссылок, которые внутри аттрибута data-popup-link содержат название класса данного поапа
      const links = popupLinks.filter(popupLink => {
         //Получаю название класса из аттрибуда
         const className = popupLink.dataset.popupLink.trim();
         //Проверяю содержится ли в нашем попапе данный класс
         if(popup.classList.contains(className)){
            return true;
         }else{
            return false;
         }
      });

      //Функция,добавляет и убирает паддинг. Аргумент set: boolean, означает надо присвоить паддинг или убрать его
      const fixedPadding = (set) => {
         //Функция принимает значение value и присваевает его элементам
         const setValue = value => {
            //Задаю body паддинг
            document.body.style.paddingRight = `${value}px`;
            //Задаю паддинг всем fixed элементам с аттрибутом data-popup-fixed-padding
            popupFixedPaddingElems.forEach(el => el.style.paddingRight = `${value}px`);
         }
         //Вычисляю ширину полоски скрола. Вычитаю ширину body из ширины окна браузера. 
         const scrollWidth = window.innerWidth - document.body.offsetWidth;
         //Если надо добавить паддинг - добавляем если надо убрать убираем
         if(set){
            //Добавляю для body класс _popup-lock, который задаёт overflow: hidden, чтобы убрать скрол у body
            document.body.classList.add('_popup-lock');
            //Устанавливаю значение пааддинга
            setValue(scrollWidth);
         }else{
            //Добавляю для попапа класс _close. Делаю это для того, что когда попап закрывается нельзя было снова открыть его,
            //нажав на ссылку.
            popup.classList.add('_close');
            //Выжидаю пока свойство transition закроет попап для пользователя, а затем убираю паддинг и возвращаю скролл и делаю это
            //безо всяких рывком. Важно, что кол-во времени, установленное в setTimeout должно быть равно времени, заданному в CSS в
            //свойстве transition
            setTimeout(() => {
               //Убираю класс _popup-lock, тем самым возвращая скролл
               document.body.classList.remove('_popup-lock');
               //Устанавливаю паддинг в нуь
               setValue(0);
               //Убираю для попапа класс _close, делаю так, что его теперь можно снова открыть
               popup.classList.remove('_close');
            }, 300);
         }
      }

      //Функция нужна для того, чтобы закрывать все открытые спойлеры, когда меню бургер закрывается.
      const closeSpoilers = (burger, menuBody) => {
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

      //Функция открывает попап. Принимает два аргумента сам попап, который нужно открыть и setPadding: boolean, отвечает за то надо ли,
      //задавать паддинг для элементов или нет, как в случа, когда попап открывается из другого попапа.
      const openPopup = (popup, setPadding = true) => {
         //Проверяем наличие у попапа класса _close. Если он есть то выходим из функции
         if(popup.classList.contains('_close'))
            return;

         //В зависимости от 2-го аргумента устанавливаем паддин или не устанавливаем
         if(setPadding){
            fixedPadding(true);
         }

         //Если ссылка, при нажатии на которую открывается попап находится в меню бургер, то при нажатии на не бургер закрывается, 
         //а попап открывается. Этот пункт является спорным и при желании от него можно избавится.
         if(document.querySelector('[data-burger]._active')){
            const burger = document.querySelector('[data-burger]._active');
            const menuBody = document.querySelector('[data-burger-menu-body]._active');

            burger.classList.remove('_active');
            menuBody.classList.remove('_active');
            document.body.classList.remove('_burger-lock');

            closeSpoilers(burger, menuBody);
         }
         //Добавляю попапу класс _active, тем самы показывая его
         popup.classList.add('_active');
      }

      //Функция, закрыает попап. Принимает 2 аргумента, сам попап, который нужно закрыть и resetPadding: boolean, который отвечает за то
      //надо ли обнулять паддинг при закрытие или не надо, как в случае если попап открывается из другого попапа.
      const closePopup = (popup, resetPadding = true) => {
         //Обнуляем или не обнуляем паддинг
         if(resetPadding){
            fixedPadding(false);
         }
         //Убираем у попапа класс _active, тем самым закрываем его
         popup.classList.remove('_active');
      }

      //Перебираю массив ссылок, которые открывают данный попап и задаю им обработчик события клика.
      links.forEach(link => link.addEventListener('click', e => {
            //Получаю активный попап если он есть.
            const activePopup = popups.find(el => el.classList.contains('_active'));
            //Если есть активный попап, то закрываем его, но не убираем паддинг, потому что сразу же будет открывать другой попап
            if(activePopup){
               //Закрываю активный попап, без убирания паддинга
               closePopup(activePopup, false);
               //Открываю попап, ссылка на которого була нажата, делаю это без задания паддинга, ведь он уже задан
               openPopup(popup, false);
            }else{
               //Если активного попапа нет, то просто открываю, тот ссылка на которогобыла нажата, также задаю паддинг
               openPopup(popup);
            }
            //Убираю действие ссылки по умолчанию
            e.preventDefault();
         })
      );
      
      //Добавляю попапу обработчик события click
      popup.addEventListener('click', e => {
         //Получаю цель, на которую кликнули
         const target = e.target;
         //Проверяю кликнули на специальный блок .popup__close, который создан длязакрытия попапа или клик произошёл мимо блока
         //.popup__content. В таком случае я закрываю попап и убирю паддинг
         if(target.classList.contains('popup__close') || !target.closest('.popup__content')){
            closePopup(popup);
         }
      });

      //Это услови нужно, чтобы событие было добавлено только один раз
      if(!index){
         //Добавляю для документа обработчик события keydown, чтобы можно было закрыть попам нажатием клавиши Escape
         document.addEventListener('keydown', ({code}) => {
            //Проверка на нажатие клавиши
            if(code == 'Escape'){
               //Получаю активный попап, если он есть
               const activePopup = popups.find(el => el.classList.contains('_active'));
               //Если он есть, то закрываю его с обнулением паддинга
               if(activePopup){
                  closePopup(activePopup);
               }
            }
         })
      }
   });
}