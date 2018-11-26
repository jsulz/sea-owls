
var genres = document.getElementsByClassName("genre-edit");

for each (genre in genres) {
  genre.addEventListener("click", function(){ displayForm(genre) });
}

//Displays the hidden edit form and autofills the values of the inputs to the current name/id
function displayForm(genre) {
  var id = (genre.id).substr(6);
  var name = genre.getAttribute("name").;
  var editform = document.getElementById("genre-edit-form");
 
  document.getElementById("edit-genre-id").value = id;
  document.getElementById("edit-genre-name").value = name;
  
  editform.style.display = "block";
}

/* The below is code to make the form disappear again when the submit button is hit, 
but if we are refreshing the page after submit then I guess this won't be necessary?

document.getElementById("edit-genre-submit").addEventListener("click", hideForm(genre));

function hideForm() {
  var editform = document.getElementById("genre-edit-form");
  editform.style.display = "none";
}
*/
