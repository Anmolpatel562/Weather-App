 const userTab=document.querySelector("[data-userWeather]");
 const searchTab=document.querySelector("[data-searchWeather]");
 const userContainer=document.querySelector(".weather-container");
 const grantAccessContainer=document.querySelector(".grant-location-container");
 const searchForm=document.querySelector("[data-searchForm]");
 const loadingScreen=document.querySelector(".loading-container");
 const userInfoContainer=document.querySelector(".user-info-container");
 const grantAccessButton=document.querySelector("[data-grantAccess]");

 let oldTab=userTab;
 const API_KEY="486d120aef7d3cce28825e243362dd5c";
 oldTab.classList.add("current-tab"); 
 getfromsessionStorage();   

 function switchTab(newTab){
     if(newTab != oldTab){
         oldTab.classList.remove("current-tab");
         oldTab = newTab;
         oldTab.classList.add("current-tab");

       if(!searchForm.classList.contains("active")){
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
         }
       else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromsessionStorage();
        }  
     }
    
 }

 userTab.addEventListener("click",()=>{
    switchTab(userTab);
 });
 searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
 });
// check if cordinates are already presnent in session storage
 function getfromsessionStorage(){
   const localCoordinates=sessionStorage.getItem("user-coordinates");
   if(!localCoordinates){
      grantAccessContainer.classList.add("active");
   }
   else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
   }
 }
 async function fetchUserWeatherInfo(coordinates){
   const{lat,lon}=coordinates;
   // make grnat contaier invisible
   grantAccessContainer.classList.remove("active");
   // make loader visible
   loadingScreen.classList.add("active"); 
   




   //API CALL
   try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
   }
   catch(error){
      loadingScreen.classList.remove("active");
      console.log("Error occured while fetching Weather Data:",error);
   } 
}

async function searchWeatherByCityName(city){
   loadingScreen.classList.add("active");
   userInfoContainer.classList.remove("active");
   grantAccessContainer.classList.remove("active");
    try{
       const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric `);
       const data =await response.json();
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);

    }
    catch(error){
      console("searchWeatherByCityName");
    }
}

function renderWeatherInfo(weatherInfo){
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryIcon]"); 
   const desc = document.querySelector("[data-weatherDesc]"); 
   const weatherIcon = document.querySelector("[data-weatherIcon]");
   const temp =document.querySelector("[data-temp]");
   const windspeed = document.querySelector("[data-windspeed]");
   const humidity = document.querySelector("[data-humidity]");
   const cloudiness = document.querySelector("[data-cloudiness]");
   
   // fetch value from data and adding in elements::::::::::::::::
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText =  `${weatherInfo?.main?.temp} °C`;
   windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = weatherInfo?.main?.humidity+"%";
   cloudiness.innerText = weatherInfo?.clouds?.all+"%";


}
function getLocation(){
   if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition)
   }
   else{
        // Show an alert for no geolocation support available:
   }
}
function showPosition(position){
   const userCoordinates = {
         lat:position.coords.latitude,
         lon:position.coords.longitude,
   }
   sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
   fetchUserWeatherInfo(userCoordinates);
}
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
   e.preventDefault();
   let city = searchInput.value;
   if(city === "")
      return
   else{
      searchWeatherByCityName(city);
   }   
});