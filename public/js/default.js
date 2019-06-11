var todaysDate = document.getElementById("todaysDate");
n = new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
todaysDate.innerHTML = "Today's Date: " + y + '-' + m + '-' + d;
var dateNow = y + '-' + m + '-' + d;