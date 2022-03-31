{
    init: function(elevators, floors) {
        
        //shared elevator logic
        elevators.forEach(elevator => {
            
            elevator.on('floor_button_pressed', (floorNum) => {
                if(!elevator.destinationQueue.includes(floorNum)) {
                    elevator.destinationQueue.push(floorNum)
                    elevator.checkDestinationQueue()
                }

                let nextFloor = elevator.destinationQueue[0]

                elevator.goToFloor(nextFloor)
            })
            
            elevator.on('passing_floor', (floorNum, direction) => {
                if(elevator.loadFactor() <= 0.7
                   && floors[floorNum].serviceRequest 
                   && floors[floorNum].serviceDirection === direction 
                  ) elevator.goToFloor(floorNum, true) 
            })
            
            elevator.on('stopped_at_floor', (floorNum) => {
                floors[floorNum].serviceRequest = false
                
                // find closest next floor en route
                if( elevator.destinationDirection() === 'up'){
                    elevator.destinationQueue.sort((a,b) => a-b)
                }else{
                    elevator.destinationQueue.sort((a,b) => b-a)
                }
                elevator.checkDestinationQueue()
            })

            elevator.on("idle", () => {
                // look through the current requests and head to the nearest floor
                let requests = floors.filter(floor => floor.serviceRequest === true)
                if(requests.length > 0){
                    elevator.goToFloor(requests[0].floorNum())
                    floors[requests[0].floorNum()].serviceRequest = false
                } else {
                    elevator.goToFloor(0)
                }
                
            });
        })

       //shared floor logic
        floors.forEach(floor => {
            floor.on('up_button_pressed', () => {
                floor.serviceRequest = true
                floor.serviceDirection = 'up'
            })
            floor.on('down_button_pressed', () => {
                floor.serviceRequest = true
                floor.serviceDirection = 'down'
            })
        })
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}