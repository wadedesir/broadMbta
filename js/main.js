
fetch('https://api-v3.mbta.com/routes?filter[type]=0,1') //grab data from mbta API
    .then(res => res.json()) //parse response as json

    .then(routes =>{ //run a function using the data
        
        // console.log(...routes.data) 
        let routeNames = [] //will hold the long name of every subway route

        for(let i = 0; i < routes.data.length; i++){ //ieterate through the data and  update the names list
            routeNames.push(routes.data[i].attributes.long_name + ' ') 
            const domUl = document.querySelector('.routes')
            let domLi = document.createElement('li')
            domLi.innerText = routes.data[i].attributes.long_name
            domUl.appendChild(domLi)
        }
            
        console.log('Names of each route: ', routeNames) //log names 

        fetch('https://api-v3.mbta.com/stops?filter[route_type]=0,1')
            .then(res => res.json())
            .then(stops =>{

                let routeStops = {} //Object to hold routeNames as well as number of stops 

                routeNames.forEach( route =>{ //filterstops for each route and the object. 

                    routeStops[route] = [...stops.data.filter( stop => {
                        let newStop = stop.attributes.description.toLowerCase().replace(/[()-]/g, '') 
                        newStop = newStop.replace(/\s{2,}/g, ' ')
                        return newStop.includes(route.toLowerCase()) //will filter by route names
                    })]

                })

                console.log('Stops for each subway route: ', routeStops) //log  our new object

                let least =  Object.keys(routeStops)[0] 

                let largest = Object.keys(routeStops).reduce(function(a, b) { //look through every property in our object and find the least and largest array values
                    
                    if(routeStops[a].length > routeStops[b].length){

                        if(routeStops[b].length < routeStops[least].length){ 
                            least = b //sets key value for smalles object
                        }

                        return a

                    }else{
                        return b
                    }

                });

                console.log('Least stops: ' + least + 'with ' + routeStops[least].length + ' stops.',
                            'Most stops: ' + largest + 'with ' + routeStops[largest].length + ' stops.')

                let filteredConnections = {}
                let routeConnections = Object.keys(routeStops).reduce( (connections, route) => { //creates abject that holds all of the routes and their stops

                    routeStops[route].forEach ( (stop, i) => { //iterates through each route

                        if(connections[route]){ //creates objects that hold names of every stop
                            connections[route] = [...connections[route], stop.attributes.name.toLowerCase()]
                        }else{
                            connections[route] = [stop.attributes.name.toLowerCase()]
                        }

                        if(filteredConnections[stop.attributes.name]){ //creates object that holds the stop - route relationships
                            if(filteredConnections[stop.attributes.name].includes(route) == false){
                                filteredConnections[stop.attributes.name].push(route)
                            }
                        }else{
                            filteredConnections[stop.attributes.name] = [route]
                        }
                        // filteredConnections.push()
                        
                    })

                    return connections

                }, {})

                Object.keys(filteredConnections).forEach( stop => { //filters out stops that connect less that 2 route
                    if (filteredConnections[stop].length <= 1){
                        delete filteredConnections[stop]
                    }else{
                        const parent = document.querySelector('.routeConnections')
                        let title = document.createElement('h2')
                        title.innerText = stop.trim()
                        let routes = document.createElement('p')
                        routes.innerText = `${[...filteredConnections[stop]]}`
                        parent.appendChild(title)
                        parent.appendChild(routes)

                    }
                })

                console.log('Stop names for each route: ', routeConnections)
                console.log('Stops that connect multiple routes:', filteredConnections)
                // let filteredStopKeys = Object.keys(filteredConnections).map( key => key.toLocaleLowerCase())
                // console.log(filteredStopKeys)
                document.querySelector('.go').addEventListener('click', getRoute) //check if button is clicked

                function getRoute(){
                    let start = document.querySelector('.start').value.toLowerCase()
                    let end = document.querySelector('.end').value.toLowerCase()

                    if (start == '' || end == ''){
                        alert('Please enter valid stops')
                    }
                    
                    let parent = document.querySelector('.stops')
                    parent.innerHTML = ''
                    Object.keys(routeConnections).forEach( route => { // subway route that connects two stops
                        if(routeConnections[route].includes(start) && routeConnections[route].includes(end) ){
                            // let newParent = document.createElement('div')
                            // newParent
                            let routeSpan = document.createElement('span')
                            routeSpan.innerText = route
                            parent.appendChild(routeSpan)

                            console.log(route, 'connects both stops')
                        }
                    })

                }

                

                
            })
    })


