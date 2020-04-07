var app = angular.module('app',['firebase'])

var config = {
    apiKey: "AIzaSyDCYDJzqPLo0I51CDQQj02PDIIxw_hW5po",
    authDomain: "conatactform.firebaseapp.com",
    databaseURL: "https://conatactform.firebaseio.com",
    projectId: "conatactform"
  };
  firebase.initializeApp(config);

  app.controller('MainCtrl',MainCtrl) 
  function MainCtrl ($scope,$firebaseAuth,$firebaseObject,$firebaseArray,$filter) {

    $scope.name = null;
    $scope.email = null;
    $scope.password =  null;
    $scope.data = {};
    $scope.CurrentDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.CurrentTime = $filter('date')(new Date(), 'HH:mm:ss');

    //authentication create function**************************************************************

    var authObj = $firebaseAuth()

    var ref= firebase.database().ref()
    var userdetail = ref.child('userdetail');

    $scope.createUserWithEmailAndPassword=function(){
        // console.log($scope.email)
        authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
          .then(function(data){

            var user = firebase.auth().currentUser;
            user.updateProfile({
              displayName: $scope.name,
              photoURL: 'http://lageniusinfo.com/images/female_user_icon_clip_art.jpg'
            }).then(function() {
              console.log(user);
              
              user.sendEmailVerification();
            }).catch(function(error) {
              console.log(error)
            });


            console.log(data.uid);
            var userdetailobject={  
                                    name: $scope.name,
                                    email: $scope.email,
                                    password: $scope.password,
                                    photoURL : 'http://lageniusinfo.com/images/female_user_icon_clip_art.jpg',
                                    uid:data.uid,
                                    Date:$scope.CurrentDate,
                                    Time:$scope.CurrentTime
                                  }
                userdetail.push().set(userdetailobject).then(()=>{
                console.log("saved")
                alert("Successfully Registered")
            })
          }).catch(function(err){
              console.log(err)
          });
    }


    //authection taking change*********************************************************************
    $scope.authObj = $firebaseAuth()
    $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
          console.log("Signed in as:", firebaseUser);
          $scope.data = $firebaseObject(ref);
          $scope.$apply();
        } else {
          console.log("Signed out", firebaseUser);
          $scope.data = {};
        }
      });


      //authentication sign in function**************************************************************
      // var authObj = $firebaseAuth()
      
      $scope.signIn = function(){
        // console.log(SingInData.email)
        var email=$scope.email
        var password=$scope.password
        // var userSignIn={email,password}
        // console.log(abc)
        authObj.$signInWithEmailAndPassword($scope.email,$scope.password).then(function(rs){
          console.log('signIn',rs.uid)
          firebase.database().ref('userdetail').orderByChild("uid").equalTo(rs.uid)
          .once('value')
          .then(snapshot => {
            // var user = firebase.auth().currentUser;
            $scope.records = snapshot.val();
            if($scope.records!=null){
              angular.forEach($scope.records,
                function(value,key) {
                  var displaydetails={
                                        Name : value.name,
                                        Email : value.email,
                                        Uid : value.uid,
                                        Date : value.Date,
                                        Time : value.Time
                  }
                  console.log("********************")  
                  console.log(displaydetails)
                  console.log("********************")
                  var userUpdate = {
                                      Date : $scope.CurrentDate,
                                      Time : $scope.CurrentTime
                                    }

                  firebase.database().ref('userdetail').child(key).update(userUpdate).then(()=>{
                                                                              alert("Sign In")
                                                                            })
                });
            }
            else{
              var userdetailobject={  name : rs.displayName,
                                      email: rs.email,
                                      photoURL : rs.photoURL,
                                      uid:rs.uid,
                                      Date:$scope.CurrentDate,
                                      Time:$scope.CurrentTime
                                    }
                userdetail.push().set(userdetailobject).then(()=>{
                console.log("saved")
                alert("Sign In")
            })
              // console.log("not found any record")
            }
           
            // console.log("**********************************", $scope.records);
          })
          .catch(error => console.log(error));
        }).catch(function(err){
          alert(err)
          $scope.error = 'email or password wrong, please try again';
          console.error('does not exist or other error');
        });
      }

      //authentication sign out function*************************************************************
      $scope.signOut = function (){
        $scope.data.$destroy();
        $scope.authObj.$signOut();
        alert("Sign Out")
      }


      //read data into database function*************************************************************

      // $scope.readUserData=function(){
      //   $scope.CurrentDate = $filter('date')(new Date(), 'dd/MM/yyyy');
      //   console.log($scope.CurrentDate)
      //   $scope.CurrentTime = $filter('date')(new Date(), 'HH:mm:ss');
      //   console.log($scope.CurrentTime)
      // }

}



