let genres = [].slice.call(document.getElementsByClassName("genre-edit"));
let authors = [].slice.call(document.getElementsByClassName("author-edit"));

genres.forEach( genre => {

	genre.addEventListener("click", function( e ){ 
		
		e.preventDefault();

		displayGenreForm(genre) 

	});

});

//Displays the hidden edit form and autofills the values of the inputs to the current name/id
function displayGenreForm(genre) {

  let id = (genre.id).substr(6);
  let name = genre.getAttribute("name");
  let editform = document.getElementById("genre-edit-form");
 
  document.getElementById("edit-genre-id").value = id;
  document.getElementById("edit-genre-name").value = name;
  
  editform.style.display = "block";

}

authors.forEach( author => {

  author.addEventListener("click", function( e ){ 
    
    e.preventDefault();

    displayAuthorForm( e ) 

  });

});

//Displays the hidden edit form and autofills the values of the inputs to the current name/id
function displayAuthorForm( event ) {

  let id = event.target.form['author-id'].value
  let fnameTD = document.getElementById( id + '-fname' );
  let lnameTD = document.getElementById( id + '-lname' );
  let fname = fnameTD.textContent;
  let lname = lnameTD.textContent;

  let editform = document.getElementById("author-edit-form");
 
  document.getElementById("edit-author-id").value = id;
  document.getElementById("edit-author-fname").value = fname;
  document.getElementById("edit-author-lname").value = lname;
  
  editform.style.display = "block";
  
}