export { throttle, slideDown, slideUP, slideToggle, isMobile, widthIsGrowPattern };

//Не даёт функции выполняться чаще чем задано в условии.
function throttle(callback, time){
   //Переменная, которая за счёт замыкания сохраниться в области видимости возвращиемой функции и будет контролировать 
   //процесс выполнения aeyrwbb
   let waiting = false;

   //Возвращаю функцию
   return function(...args){
      //Если ждёт, то нельзя выполнять функцию
      if(waiting)
         return;

      //Вызываю функцию
      callback(...args);
      //После выполнения начинаем ждать
      waiting = true;

      //Ждём установленное время, пока setTimeout не закончит своё выполнение нельзя больше выполнять функцию
      setTimeout(() => {
         waiting = false;
      }, time);
   }
}

//Развёртывает блок
function slideDown(target, duration = 300){
   if(!target.classList.contains('_slide')){
      target.classList.add('_slide');
      target.classList.remove('_hidden');
      const height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0 + 'px';
      target.style.paddingTop = 0;
      target.style.marginTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionDuration = duration + 'ms';
      target.style.transitionProperty = 'height, margin, padding';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.style.removeProperty('overflow');
         target.classList.remove('_slide');
      }, duration);
   }
}

//Скрывает блок
function slideUP(target, duration = 300){
   if(!target.classList.contains('_slide')){
      target.classList.add('_slide');
      const height = target.offsetHeight;
      target.style.transitionDuration = duration + 'ms';
      target.style.transitionProperty = 'height, margin, padding';
      target.style.height = height + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0 + 'px';
      target.style.paddingTop = 0;
      target.style.marginTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginBottom = 0;
      setTimeout(() => {
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('height');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.style.removeProperty('overflow');
         target.classList.remove('_slide');
         target.classList.add('_hidden');
      }, duration);
   }
}

//В зависимости от параметра hidden, то скрывает то раскрывает блок
function slideToggle(target, duration = 300){
   if(target.classList.contains('_hidden')){
      slideDown(target, duration);
   }else{
      slideUP(target, duration);
   }
}

//Функция any возвращает true если страница открыта на мобильном устройстве.
const isMobile =  {
   'Android': function(){ 
      return navigator.userAgent.match(/Android/i);
   },
   'BlackBerry': function(){
      return navigator.userAgent.match(/BlackBerry/i);
   },
   'iOS': function(){
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   'Opera': function(){
      return navigator.userAgent.match(/Opera Mini/i);
   },
   'Windows': function(){
      return navigator.userAgent.match(/IEMobile/i);
   },
   'any': function(){
      return (
         this.Android() ||
         this.BlackBerry() ||
         this.Opera() ||
         this.Windows() ||
         this.iOS()
      );
   } 
}

//Функция, нужна для того, чтобы определить мы уменьшаем ширину экрана или увеличиваем её. Если уменьшаем или стоим на месте, то возвращаем false.
//Если увеличиваем то возвращаем true.
const widthIsGrowPattern = () => {
   //Замыкаю переменную, с которой будет сравниваться нынешняя ширина объекта window
   let widthOld = window.innerWidth;
   //Замывкаю переменную, которая будет отвечать за выводимый результат, чтобы его можно было просто получить когда захочется  
   let result = false;
   //Замыкаю функцию, которая будет выполнять необходимые вычисления. принимает параметр check, который по умолчанию равен false. Параметр отвечает за то
   //будет ли производится вычисление или просто вернётся сохранённый результат.
   const perform = (check = false) => {
      //Проверка на check
      if(!check){
         //Переменная отвечает за нынешнее состояние ширины экрана
         let widthNow = window.innerWidth;
         //Дублирую переменную, отвечающию за ширину экрана, которая была раньше.
         let oldValue = widthOld;
         //Присваевую замкнутой переменной новое значение ширины.
         widthOld = widthNow;
         //Вычисляю результат
         result =  widthNow > oldValue;
      }
      return result;
   }  
   //Замыкаю функцию perform
   return perform;
}