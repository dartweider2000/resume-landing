import axios from "axios";
import config from "./api.config";

class ApiService{
   constructor(config){
      this.config = config;
   }

   async getWeather(q){
      try{
         const res = await axios.get(this.config.url, {
            'params': {
               'appid': this.config.apiKey,
               'lang': this.config.lang,
               'units': this.config.units,
               q
            }
         });


         //console.log(res.data);

         return res.data;
      }catch(err){
         console.log(err.message);
      }
   }
}

const apiService = new ApiService(config);
export default apiService;