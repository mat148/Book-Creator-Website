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
  /*firebase.database().ref('users/' + postId + '/user-books').on('value', function(snapshot) {
    console.log("snapshot: "+ snapshot + " postElement: "+ postElement);
    //updateBookList(postElement, snapshot.val());
  });*/
  
  //var userBooksRef = firebase.database().ref('user-books/' + uid);

  /*var fetchPosts = function(postsRef) {
    postsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createPostElement(data.key, data.val().title, data.val().body, data.val().author),
        containerElement.firstChild);
    });
  };*/

  //fetchPosts(topUserPostsRef, topUserPostsSection);
  //fetchPosts(userBooksRef);
  //fetchPosts(userPostsRef, userPostsSection);
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
  
});