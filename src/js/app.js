import { spoiler } from './modules/spoiler.js';
import { burgerMenu } from './modules/burger.js';
import { tab } from './modules/tab.js';
import { isMobile } from './modules/functions.js';
import { popup } from './modules/popup.js';
import { adaptive } from './modules/dinamicAdaptive.js';


const mobileOrDesktop = () => {
   if(isMobile.any()){
      document.body.classList.add('_touch');
   }else{
      document.body.classList.add('_hover');
   }
}

mobileOrDesktop();
//document.addEventListener('mou')

spoiler(); //Запуск спойлеров
burgerMenu(); //Запуск бургера
//tab(); //Запускаю табы
//popup(); //Запуская попапы
//adaptive() //Запускаю динамический адаптив

[...document.links].forEach(link => link.addEventListener('click', e => e.preventDefault()));

const scrolIsUp = () => {
   let scroll = scrollY;
   const check = () => {
      let scrollNow = scrollY;
      let delta = scroll - scrollNow;
      scroll = scrollNow;
      return delta > 0;
   }
   return check;
};

// const scr = scrolIsUp();

// document.addEventListener('scroll', () => console.log(scr()));

const init = () => {
   if(!document.querySelector('[data-header-change]'))
      return;

   const header = document.querySelector('[data-header-change]');
   const headerStartChangeSelector = header.dataset.headerChange;
   const changeDirectionElement = document.querySelector(headerStartChangeSelector);
   let changeStart = changeDirectionElement.offsetTop;
   const scroll = scrolIsUp();
   const windowScrollHandler = () => {
      const scrollValue = scroll();
      if(!scrollValue){
         if(scrollY + header.offsetHeight >= changeStart){
            header.classList.add('_change');
         }
      }else if(scrollValue){
         if(scrollY + header.offsetHeight < changeStart){
            header.classList.remove('_change');
         }
      }
      changeStart = changeDirectionElement.offsetTop;
   };
   // const windowHeaderLittleBigResizeHandler = () => {
   //    changeStart = changeDirectionElement.offsetTop;
   //    if(window.innerWidth < 768){
   //       header.classList.remove('little-big');
   //    }else{
   //       if(pageYOffset + header.offsetHeight >= changeStart){
   //          header.classList.add('little-big');
   //       }
   //    }
   // };
   // windowHeaderLittleBigResizeHandler();
   // window.addEventListener('resize', () => {
   //    setTimeout(() => windowHeaderLittleBigResizeHandler, 300);

   // });
   window.addEventListener('scroll', windowScrollHandler);
};

init();