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