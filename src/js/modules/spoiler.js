//Импортирую нужные функции
import { slideUP, slideDown } from "./functions.js";
//Экспортирую, чтобы потом использовать в главном файле
export { spoiler };
//Блок спойлеров:
//Блок спойлеров имеет всегда аттрибут data-spoilers="(max/min), (number)"
//1-ый параметр это тип медиа запроса, будет он max-width или min-width
//2-ой параметр это число, ширина, на которой будет действовать breckpoint
//Блок спройлеров может иметь или не иметь аттрибут data-one-spoiler.
//Елси имеет это значит, что в один момент времени может быть открыт только один спойлер
//Если не имеет значит, что могут быть открыты сразу все спойлеры.
//Блок спойлеров всегда состоит из одно или более спойлеров.
//Спойлер:
//Аттрибутов не имеет. Выполняет роль простой обёртки. Состоит всегда из 2-ух элементов: title и body 
//Title:
//Имеет всегда аттрибут data-spoiler-title. Внутрь, автоматическb добавляется span с аттрибутом data-spoiler-span,
//которому автоматически применено свойство  visibilitu: hidden, до того как сработает медиа запрос. После медиа запроса title получает класс _init,
//который делает span видимым. Когда происходит нажатие на title в _init режиме, ему даётся класс _active,
//который задаёт поведение блоку span. После ещё одного нажатия на title, класс _active убирается.
//Body:
//Имеет всегда аттрибут data-spoiler-body. 
//После спрабатывания медиа запроса, ему задаётся hidden=true. Когда, title становится _active, body задаётся hidden=false и
//на время расскрытия-закрытия задаётся класс _slide, после расскрытия-закрытия класс убирается.
const spoiler = () => {
   //Если нет блока спойлеров
   if(!document.querySelectorAll('[data-spoilers]').length)
      return;
   //Получаю все блоки спройлеров в документе
   const spoilerBlocks = Array.from(document.querySelectorAll('[data-spoilers]'));

   //Начало программы, перебираю все блоки спройлеров
   spoilerBlocks.forEach(block => {
      //Получаю блок все titles внитри блока спойлеров
      const titles = Array.from(block.querySelectorAll('[data-spoiler-title]'));
      //Получаю блок все bodies внитри блока спойлеров
      const bodies = Array.from(block.querySelectorAll('[data-spoiler-body]'));

      //Получаю массив из 2-х, переданных в data-spoiler, аргументов
      const dataset = block.dataset.spoilers.split(',').map(el => el.trim());
      //Создаю медиа запрос
      const mediaQuery = `(${dataset[0]}-width: ${dataset[1]}px)`;
      //Получаю matchMedia
      const matchMedia = window.matchMedia(mediaQuery);

      //Создаю обработчик события change для matchMedia, который будет сработывать при пересечении экраном заданной ширины
      const listener = e => {
         //matches - boolean, будет равно true если ширина удовлетворяет медиа запросу и false если не удовлетворяет
         if(matchMedia.matches){
            //Закрываю все body в блоке
            bodies.forEach(body => body.classList.add('_hidden'));
            //Блок span появляется
            titles.forEach(title => title.classList.add('_init'));
         }else{
            //Открываю все body в блоке
            bodies.forEach(body => body.classList.remove('_hidden'));
            //Скрываю болок span и деактивирию его, для того чтобы он не остался в таком положении.
            titles.forEach(title => title.classList.remove('_init', '_active'));
         }
      }

      //Функция деактивирует открытый спойлер. Превращает его в закрытый
      const closeSpoiler = (title) => {
         //Возвращию span в обычное положение
         title.classList.remove('_active');
         //Поднимаю body и скрываю его
         slideUP(title.nextElementSibling);
      }

      //Функция деактивирует сам открытый спойлер, а также все его дочерние открытые спойлеры.
      const closeAllSpoilers = (title) => {
         //Закрываем родительский спойлер
         closeSpoiler(title);
         //Закрываем дочерние спойлеры
         Array.from(title.nextElementSibling.querySelectorAll('[data-spoiler-title]._active')).forEach(el => closeSpoiler(el));
      }

      //Прогоняю массив titles 
      titles.forEach(title => {
         //Добавляю элемент span к title, даю ему аттрибут data-spoiler-span
         title.insertAdjacentHTML('beforeend', '<span data-spoiler-span></span>');
         //Добавляю обработчики события клика на title 
         title.addEventListener('click', e => {
            //В условии указано, что нельзя кликать на title пока какой-либо body расскрывается-закрывается, а также
            //нужно, чтобы title имел класс _init, то есть нужно, что бы сработал медиа запрос.  
            if(!title.nextElementSibling.classList.contains('_slide') && title.classList.contains('_init')){
               //Проверяю есть ли у данного элемента родитель с аттрибутом data-one-spoiler. Если есть, значит возможно
               //нужно будет закрыть какой-либо другой спойлер
               if(title.closest('[data-one-spoiler]')){
                  //Перебираю titles, чтобв узнать нужно-ли закрыть какой-либо body
                  titles.forEach(el => {
                     //Нужно чтобы el не был тем title, на который кликнули. С тем title, на который кликнули мы произведём 
                     //действие позже.
                     if(el !== title && el.classList.contains('_active')){
                        //Закрываю спойлеры
                        closeAllSpoilers(el);
                     }
                  });
               }

               //Активирую span, у элемента на который кликнули
               title.classList.toggle('_active');

               //Если у спойлера нет класса _active, то закрываю и все его дочерние спойлеры
               if(!title.classList.contains('_active')){
                  closeAllSpoilers(title);
               }

               //Расскрываю body
               slideDown(title.nextElementSibling);
            }
         }
      )});

      //Вызываю обработчик отдельно, это связано с внутреней реализацией медиа запросов в JS. Так как сам обработчик вызывается
      //только при пересечении определённый отметки, а если страница открыта где-то в стороне от этой отметки, то обработчик уже 
      //не вызовется. Поэтому для корректной работы вызываю его отдельно. Медиа запросы в CSS и JS, немного отличаются друг от друга.
      listener();
      //Дбавляю обработчик события
      matchMedia.addEventListener('change', listener);
   });
}