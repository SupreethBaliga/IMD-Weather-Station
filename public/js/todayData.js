var dateData = document.getElementById("dateText");
n = new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
dateData.value = y + '-' + m + '-' + d;