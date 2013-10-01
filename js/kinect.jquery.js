(function($){
	$.kinect = function(options){
		var hand_pos=0;
		var handx = Array(0,0,0);
		var handy = Array(0,0,0);
		var handz = Array(0,0,0);
		var approve_swipe=true;
		var settings = $.extend(
		{

			time:400, //TIME BETWEEN POSITION CHECKS

			swipe_delay:1000, //TIME BETWEEN SWIPES

			x_offset:200, //NUMBER OF PX TO OFFSET

			y_offset:100, //NUMBER OF PX TO OFFSET

			z_offset:0, //NUMBER OF PX TO OFFSET

			hand: 'right',

			right_callback: null, //RIGHT SWIPE CALLBACK function(){	}

			left_callback: null, //LEFT SWIPE CALLBACK function(){	}

			up_callback: null, //UP SWIPE CALLBACK function(){	}

			down_callback: null,  //DOWN SWIPE CALLBACK function(){		}

			push_callback: null, //PUSH CALLBACK function(){	}

			pull_callback: null

			},options);
		function remove_approval()
		{
			approve_swipe=false;
			setTimeout(function(){approve_swipe=true;},settings.swipe_delay);
		}
		function kinect_paste(time_per){
			var hand_array = hand_pos;
			var x = Math.round(hand_array[0]);
			var y = Math.round(hand_array[1]);
			var z = Math.round(hand_array[2]);
			handx[0]=handx[1];
			handx[1]=handx[2];
			handx[2]=x;
			handy[0]=handy[1];
			handy[1]=handy[2];
			handy[2]=y;
			handz[0]=handz[1];
			handz[1]=handz[2];
			handz[2]=z;
			if(handx[1]>handx[2]+settings.x_offset && handx[0]>handx[1]+settings.x_offset && approve_swipe==true &&  $.isFunction(settings.left_callback)==true)
			{
				settings.left_callback.call(this);
				remove_approval();
			}
			if(handx[1]<handx[2]-settings.x_offset && handx[0]<handx[1]-settings.x_offset && approve_swipe==true && $.isFunction(settings.right_callback)==true)
			{
				settings.right_callback.call(this);
				remove_approval();
			}
			if(handy[1]>handy[2]+settings.y_offset && handy[0]>handy[1]+settings.y_offset && approve_swipe==true && $.isFunction(settings.down_callback)==true)
			{
				settings.down_callback.call(this);
				remove_approval();
			}
			if(handy[1]<handy[2]-settings.y_offset && handy[0]<handy[1]-settings.y_offset && approve_swipe==true && $.isFunction(settings.up_callback)==true)
			{
				settings.up_callback.call(this);
				remove_approval();
			}
			if(handz[1]<handz[2]-settings.z_offset && handz[0]<handz[1]-settings.z_offset && approve_swipe==true && $.isFunction(settings.pull_callback)==true)
			{
				settings.pull_callback.call(this);
				remove_approval();
			}
			if(handz[1]>handz[2]+settings.z_offset && handz[0]>handz[1]+settings.z_offset && approve_swipe==true && $.isFunction(settings.push_callback)==true)
			{
				settings.push_callback.call(this);
				remove_approval();
			}
			setTimeout(function(){kinect_paste(time_per);},time_per.time);
		}
		zig.addEventListener('loaded',function(){
			var user1 = zig.EngageUsersWithSkeleton(1);
			user1.addEventListener('userengaged', function(user) {
				user.addEventListener('userupdate', function(user) {
						if(settings.hand=='right')
						{
							hand_pos =  user.skeleton[zig.Joint.RightHand].position;
						}
						if(settings.hand=='left')
						{
							hand_pos =  user.skeleton[zig.Joint.LeftHand].position;
						}
					});
			});
			zig.addListener(user1);
			setTimeout(function(){kinect_paste({time:settings.time});},settings.time);
		});

	}
}(jQuery))
