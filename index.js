{
    init: function(elevators, floors) {
        
        //shared elevator logic
        elevators.forEach(elevator => {
            
            elevator.on('floor_button_pressed', (floorNum) => {
                elevator.goToFloor(floorNum)
                /* if(!elevator.destinationQueue.includes(floorNum)) {
                    elevator.destinationQueue.push(floorNum)
                }*/
            })
            
            elevator.on('passing_floor', (floorNum, direction) => {
                if(floors[floorNum].serviceRequest && floors[floorNum].serviceDirection === direction ) elevator.goToFloor(floorNum, true) 
            })
            
            elevator.on('stopped_at_floor', (floorNum) => {
                floors[floorNum].serviceRequest = false
            })

            elevator.on("idle", () => {
                // look through the current requests and head to the nearest floor
                let requests = floors.filter(floor => floor.serviceRequest === true)
                if(requests.length > 0){
                    elevator.goToFloor(requests[0].floorNum())
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