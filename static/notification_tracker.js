const State = {
    RUNNING: 0,
    STOPPED: 1
}

class NotificationTracker{
    constructor(name, time){
        this.name = name;
        this.current_time = time;
        this.original_time = time;
        this.state = State.RUNNING;
        this.looping = false;
    }

    isRunning(){
        return this.state === State.RUNNING;
    }

    isStopped(){
        return this.state === State.STOPPED;
    }

    toggleState(){
        if(this.state === State.RUNNING){
            this.state = State.STOPPED;
        } else {
            this.state = State.RUNNING;
        }
    }

    decrementTime(){
      if(this.isRunning() && this.current_time > 0) this.current_time--;
    }

    justFinished(){
        return this.current_time === 0 && this.isRunning()
    }

    resetTimer(){
      this.current_time = this.original_time;
    }

    restartTimer(){
      if(this.isStopped()) this.toggleState();
      this.resetTimer();
    }

    restartOrContinueTimer(){
      if(this.isStopped() && this.current_time > 0)
        this.toggleState()
      else
        this.restartTimer();
    }

}
