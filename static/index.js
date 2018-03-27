const app = new Vue({
	el: "#app",
	data: {
		notifications: [],
		notification_name: "",
		notification_time: ""
	},
	methods: {
		addNotification(){
			if(!this.validUserNotifText()) return;
      this.notifications = this.notifications.concat(new NotificationTracker(this.notification_name, this.notification_time));
			this.clearUserNotifText();
		},
		validUserNotifText(){
			return this.notification_name.length > 0 && this.notification_time.length > 0;
		},
		clearUserNotifText(){
			this.notification_name = "";
			this.notification_time = "";
		},
		tick(){
		    this.notifications.map(notification => {notification.tick()});
		},
		notify(){
			for(let i = 0; i < this.notifications.length; i++){
				if(this.notifications[i].justFinished()){
					notifier.notify("Notifier App", this.notifications[i].name);
				}
			}
		},
	},
  mounted(){
    setInterval(() => {
    	app.tick();
    	app.notify();
    }, 1000);
  }
});

const notifier = new Notifier();
notifier.requestDesktopNotificationPermission();
