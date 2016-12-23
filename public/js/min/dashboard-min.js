/* globals firebase:true */
/* globals console:true */
/* globals name:true */


var name, email, photoUrl, uid;

var bookSettingsPopup = $('#bookSettingsPopup');
var bookVisibility;
var bookTitle = $('#book-name');
var bookTemplate;
//var bookSettingsButton = $('.bookSettingsButton');

// Writes the user's data to the database.
function writeUserData(uid, name, email) {
  firebase.database().ref('users/' + uid).set({
    username: name,
    email: email
  });
}

// Starts listening for new posts and populates posts lists.
function startDatabaseQueries() {
  //var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('all-books/' + uid).once('value').then(function(snapshot) {
    var size = Object.keys(snapshot.val()).length;
    $.each(snapshot.val(), function(i, val){
      //console.log(i);
      //console.log(val);
      var title = val.bookTitle;
      var template = val.bookTemplate;
      var visibility = val.visibility;
      var html ='<div class="book">'+
                '</div>';
      $("#content").append(html);
    });
  });
}

function login(){
  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //splashPage.style.display = 'none';
      writeUserData(user.uid, user.displayName, user.email);
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      //console.log(photoUrl);
      uid = user.uid;
      console.log('user: '+user+', uid: '+uid+' name: '+name+', email: '+email+', photoURL: '+photoUrl);
      //console.log($('.user-image'));
      
      $.ajax({
        url: photoUrl,
        crossDomain: true,
        type:'HEAD',
        error:
        function(){
          console.log('error');
          //*** Remove this before delpoy **//
          $('.user-image').css({"background-image" : "url("+photoUrl+")"});
          $('.account-name').append(""+name+"");
          startDatabaseQueries();
        },
        success:
        function(){
          $('.user-image').css({"background-image" : "url("+photoUrl+")"});
          $('.account-name').append(""+name+"");
          startDatabaseQueries();
        }
      });
    } else {
      window.location.href = "login.html";
    }
  });
}

$(document).ready(function(){
  
  login();
  
  $('#add-book').click(function(){
    $(".pop-up").toggleClass("invisible");
    $(".blackout").toggleClass("invisible");
  });
  
  $('.signout').click(function(){
    window.location.href = "login.html";
  });
  
  // Saves book settings on button click
  bookSettingsPopup.submit(function(e){
    e.preventDefault();
    
    bookVisibility = $('.selected input[name=bookVisibility]').val();
    bookTemplate = $('.selected input[name=bookTemplate]').val();
    var bookSettingsData = {
      uid: uid,
      visibility: bookVisibility,
      bookTitle: bookTitle.val(),
      bookTemplate: bookTemplate
    };
    
    //Get a key
    var newBookKey = firebase.database().ref().child('books').push().key;
    
    var updates = {};
    updates['/all-books/'+uid+'' + '/'+newBookKey+''] = bookSettingsData;
    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    
    $(".pop-up").toggleClass("invisible");
    $(".blackout").toggleClass("invisible");
    
    firebase.database().ref().update(updates);
    window.location.href = "book-creator.html";
  });
});

