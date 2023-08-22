export { tab };
/*
Блок табов:
Ему задаётся аттрибут data-tab.Содержит в себе 2 элемента: head и wrappper
Head:
Блок, которому задаётся аттрибут data-tab-head и, который содержит в себе блоки, на которые надо кликать, чтобы менялось содержимое таба
Wrapper:
Блок, которому задаётся аттрибут data-tab-wrapper и, который содержит в себе блоки, хранящие содержимое таба.
*/
const tab = () => {
   //Если таких элементов нет, то не выполняю
   if(!document.querySelectorAll('[data-tab]').length)
      return;
   //Получаю все блоки табов, находящиеся в документе.
   const tabs = Array.from(document.querySelectorAll('[data-tab]'));
   //Прогоняю массив и работаю с каждым блоком по отдельности
   tabs.forEach(tab => {
      //Получаю все titles, на которые надо нажимать
      const titles = Array.from(tab.querySelector('[data-tab-head]').children);
      //Получаю все bodies, которые хранят контент таба.
      const bodies = Array.from(tab.querySelector('[data-tab-wrapper]').children);

      //Скрываю все body
      bodies.forEach(body => body.classList.add('_hidden'));

      //Функция, которая будет показывать или скрывать таб, в зависимости от условий
      const toggle = (title) => {
         //Получаю класс элемента body, который нужно будет открыть или скрыть
         const tabClass = title.dataset.tabClass;
         //С помощью класса нахожу сам элемент body
         const tabBody = tab.querySelector(tabClass);

         //Проверка условия
         if(tabBody.classList.contains('_hidden')){
            //Открываю данный таб, добавляю блоку title класс _active
            title.classList.add('_active');
            //Задаю для блока body параметр hidden = false
            tabBody.classList.remove('_hidden');
         }else{
            //Скрываю данный таб, убираю с блока title класс _active
            title.classList.remove('_active');
            //Задаю для блока body параметр hidden = true
            tabBody.classList.add('_hidden');
         }
      }

      //Перебираю все titles, находящиеся в head
      titles.forEach((title, index) => {
         //Создаю класс, который потом будет добавлен элементу body, который имеет аналогичный с title индекс.
         const tabClass = `_tab-${index}`;

         //Создаю у title аттрибут data-tab-class, благодаря которому я буду определять, какой блок боди нужно открыть
         title.dataset.tabClass = `.${tabClass}`;
         //Добавляю созданный класс и самому блоку body
         bodies[index].classList.add(tabClass);

         //Задаю обработчик события click блоку title
         title.addEventListener('click', e => {
            //Проверка на то, какой таб сейчас открыт
            titles.forEach(el => {
               //Если открыт и не равен тому title, на который кликнули, то закрываем.
               if(el !== title && el.classList.contains('_active')){
                  toggle(el);
               }
            });

            //Если кликнули на таб и у него нет класса _active, то открываем таб 
            if(!title.classList.contains('_active')){
               toggle(title);
            }
         });

         //Всегда должен быть открыт какой-нибудь таб, и я выбрал всегда по умолчанию открывать первый
         if(!index){
            toggle(title);
         }
      });
   });
}