var serverUrl = "https://localhost:8000/api/";

$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
    var $this = $(this),
        label = $this.prev('label');
  
        if (e.type === 'keyup') {
              if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
              } else {
              label.removeClass('highlight');   
              }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
              label.removeClass('highlight'); 
              } 
        else if( $this.val() !== '' ) {
              label.addClass('highlight');
              }
      }
  
  });
  
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
  });

$("#usernameInput").on("keyup", ()=>{
    var checkUsername = $.trim($("#usernameInput").val());
    if(checkUsername != ""){
        $.ajax({
            url: serverUrl+"user/usernameavailability/",
            type: "POST",
            crossDomain: true,
            data: {
                "username"   : checkUsername,
            },
            success: function(data){
                if(data.status_code == 200){
                    var availabilityStatus = data.data;
                    if(availabilityStatus == "available"){
                        $("#registerSubmit").prop("disabled", false);
                        $("#usernameAvailabilityStatus").html("Username available!");
                        console.log("Username available!");
                    }
                    else if(availabilityStatus=="unavailable"){
                        $("#registerSubmit").prop("disabled", true);
                        $("#usernameAvailabilityStatus").html("Username unavailable!");
                        console.log("Username unavailable!");
                    }
                }
            }
        });
    }
    else{
        $("#registerSubmit").prop("disabled", true);
        $("#usernameAvailabilityStatus").html("Username cannot be empty!");
        console.log("Username cannot be empty!");
    }
});