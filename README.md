# IMD-Weather-Station
A simple attempt at trying to simulate the working of a simple weather app. This app stores the weather data of the registered
for each day. For now, the data has to be manually entered but on further development of the app, facility for automatically
updating the data will be added.

## Technologies Used:
1. ExpressJS
2. Mongoose
3. HTML,CSS & JS
4. MongoDB Database
5. PassportJS
6. EJS

## Working of the app:
1. The app consists of 3 levels of authorisation: IMD Admin, City Admin and Guest User.
-- IMD Admin can only register cities and view data.
-- City Admins of registered cities can update the weather data of their city .
-- Guest users can only view data.

2. The required links are:
-- '/' : Today's weather data of the default city.
-- '/[city]' : Today’s weather data of specified city is shown. If the city is not registered, 404 error page is displayed.
               If today’s weatherdata is not updated by city admin then all the data is shown as N/A.
-- '/[city]/[date]' : The weather data of specified city on specified date is shown. Please use the date format YYYY-MM-DD.
-- '/login' : The login page.
-- '/logout' : The logout page.
-- '/updateData' : The page only available to City Admins to update today’s meteorological data to the server.
-- '/registerCity' : The page only available to IMD Admin to register the city.Registration requires city name, a username
                      for city admin and the corresponding password.
                 
