
const parseJSON = (xhr,content, selectedTeam) => {
    // Double check if it updated
    if(xhr.status == 204){
      return;
    }
    const obj = JSON.parse(xhr.response);
    console.dir(obj);

    

    // if users are in the response, show them
    if(obj.data) {

      // Delete present content in html
      while(content.firstChild){
        content.removeChild(content.firstChild);
      }
      // Generate cards for each player in the selected team
      for(var item in obj.data.team[selectedTeam]){

        // Player card and container holding data
        const card = document.createElement('div');
        const container = document.createElement('div');
        card.className = "card";
        container.className = "container";

        // Name
        const nameHeader = document.createElement('h4');
        nameHeader.textContent = `${obj.data.team[selectedTeam][item].name}`;
        

        // Position
        const positionHeader = document.createElement('p');
        positionHeader.textContent = ` ${obj.data.team[selectedTeam][item].position}`;

        // Image
        const image = document.createElement('img');
        image.src = obj.data.team[selectedTeam][item].img;
        
        // Goals
        const pointsContent = document.createElement('p');
        pointsContent.textContent = `Goals: ${obj.data.team[selectedTeam][item].goals} Assists:${obj.data.team[selectedTeam][item].assists} `;
       
        // Hookup
        container.append(nameHeader);
        container.append(image);
        console.log("yeet");
        container.append(positionHeader);
        container.append(pointsContent);
        card.append(container);
        content.append(card);
      }
    }
  };

  // handle responses
  const handleResponse = (xhr, parseResponse, selectedTeam) => {
    const content = document.querySelector('#content');

    // check status codes
    // need to account for 200, 201, 204, 400, 404
    // displaying to console for most
    switch(xhr.status){
      case 200: // success
        console.dir(xhr.status);
        break;
      case 201: // created
        console.dir(xhr.status);
        break;  
      case 204: // updated
        console.dir(xhr.status);
        break;
      case 400: // bad request
        console.dir(xhr.status);
        break;
      default: // any other status code // might change
        console.dir(xhr.status);
        break;
    }

    // Only parse response on get requests 
    // Can prob always do this?
    if(parseResponse){
      parseJSON(xhr,content, selectedTeam);
    } 
    
  };

  const sendAjax = (e,form) => {
    // Handle the GET
    if(form.id == "teamSelections"){
      const selectedTeam = form.querySelector("#teamSelect").value;
      console.log(selectedTeam);
      const url = form.getAttribute("action");
      const method = form.getAttribute("method");
      const xhr = new XMLHttpRequest();
      xhr.open(method,url);
      xhr.setRequestHeader('Accept', 'application/json');
      if(method == 'get'){
        xhr.onload = () => handleResponse(xhr,true, selectedTeam);
      } else { //head request no body responses
        xhr.onload = () => handleResponse(xhr,false);
      }
      xhr.send();
      
    } 
    else // POST
    {
      // PROJECT API
      const playerAction = form.getAttribute('action');
      const playerMethod = form.getAttribute('method');

      // Grab fields from querySelector
      const nameField = form.querySelector('#nameField');
      const positionField = form.querySelector('#positionField');
      const teamField = form.querySelector('#teamField');
      const goalsField = form.querySelector('#goalsField');
      const assistsField = form.querySelector('#assistsField');
      const imgField = form.querySelector('#imgField');

      // Create ajax request
      const xhr = new XMLHttpRequest();
      xhr.open(playerMethod, playerAction);

      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Accept', 'application/json');
  
      
      xhr.onload = () => handleResponse(xhr,true, teamField);

      //Assign data
      const formData = `name=${nameField.value}&position=${positionField.value}&team=${teamField.value}&goals=${goalsField.value}&assists=${assistsField.value}&img=${imgField.value}`;
      xhr.send(formData);
      
    }
    // Prevent page from changing
    e.preventDefault();
    return false;
  };
  // Set-up
  const init = () => {
    // Grab forms
    const playerForm = document.querySelector('#playerForm');
    const teamSelections = document.querySelector('#teamSelections');
    

    // Create handlers
    const addPlayer = (e) => sendAjax(e,playerForm);
    const getTeam = (e) => sendAjax(e,teamSelections);

    // Attach to events
    
    playerForm.addEventListener('submit', addPlayer);
    teamSelections.addEventListener('submit', getTeam);
  }

  window.onload = init;