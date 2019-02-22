


const parseJSON = (xhr,content, selectedTeam) => {
    // Double check if it updated
    if(xhr.status == 204){
      return;
    }
    const obj = JSON.parse(xhr.response);
    console.dir(obj);

    

    // if users are in the response, show them
    if(obj.data) {

      // Delete present content in html - would be 10x better if I used React
      // For this project but oh well
      while(content.firstChild){
        content.removeChild(content.firstChild);
      }
      console.log(selectedTeam);
      // Generate cards for each player in the selected team
      for(var item in obj.data[selectedTeam]){
        console.log(item);
        console.log(obj.data[selectedTeam][item].goals);
        // Player card and container holding data
        const card = document.createElement('div');
        const container = document.createElement('div');
        card.className = "card";
        container.className = "container";

        // Name
        const nameHeader = document.createElement('h4');
        nameHeader.textContent = `${obj.data[selectedTeam][item].name}`;
        

        // Position
        const positionHeader = document.createElement('p');
        positionHeader.textContent = ` ${obj.data[selectedTeam][item].position}`;

        // Goals
        const pointsContent = document.createElement('p');
        pointsContent.textContent = `Goals: ${obj.data[selectedTeam][item].goals} Assists:${obj.data[selectedTeam][item].assists} `;
       
        container.append(nameHeader);
        container.append(positionHeader);
        container.append(pointsContent);
        card.append(container);
        content.append(card);
      }
      
      // userList.textContent = users;
      // content.appendChild(userList);
    }
  };

  // handle responses
  const handleResponse = (xhr, parseResponse, selectedTeam) => {
    const content = document.querySelector('#content');

    // check status codes
    // need to account for 200, 201, 204, 400, 404
    switch(xhr.status){
      case 200: // success
        //content.innerHTML = `<b>Success</b>`;
        break;
      case 201: // created
        //content.innerHTML = `<b>Created</b>`;
        break;  
      case 204: // updated
        //content.innerHTML = `<b>Updated</b>`;
        break;
      case 400: // bad request
        content.innerHTML = `<b>Bad Request</b>`;
        break;
      default: // any other status code // might change
        content.innerHTML = `Resource Not Found`;
        break;
    }

    if(parseResponse){
      
      parseJSON(xhr,content, selectedTeam);
    } else {
      console.log('received');
    }
    
  };

  const sendPost = (e,form) => {
    // There's prob a better way to handle this
    // But, it would have to check the form either way
    // And would need to send different xhr sends 
    // So I just chunked them both together
    if(form.id == "teamSelections"){
      const selectedTeam = form.querySelector("input").value;
      console.log(selectedTeam);
      const url = form.getAttribute("action");
      const method = form.getAttribute("method");
      const xhr = new XMLHttpRequest();
      xhr.open(method,url);
      xhr.setRequestHeader('Accept', 'application/json');
      if(method == 'get'){
        xhr.onload = () => handleResponse(xhr,true, selectedTeam);
      } else { //head request?
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

      // Create ajax request
      const xhr = new XMLHttpRequest();
      xhr.open(playerMethod, playerAction);

      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.onload = () => handleResponse(xhr,true);

      //Assign data
      const formData = `name=${nameField.value}&position=${positionField.value}&team=${teamField.value}&goals=${goalsField.value}&assists=${assistsField.value}`;
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
    const addPlayer = (e) => sendPost(e,playerForm);
    const getTeam = (e) => sendPost(e,teamSelections);

    // Attach to events
    
    playerForm.addEventListener('submit', addPlayer);
    teamSelections.addEventListener('submit', getTeam);
  }

  window.onload = init;