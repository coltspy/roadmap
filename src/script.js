function setActivePage(page) {
  var navbarAnchors = document.querySelectorAll('.navbar a');
  navbarAnchors.forEach(function(anchor) {
    anchor.classList.remove('active');
  });

  var activeAnchor = document.querySelector(`.navbar a[onclick*="${page}"]`);
  if (activeAnchor) {
    activeAnchor.classList.add('active');
  }

  var contentSections = document.querySelectorAll('.content-section');
  contentSections.forEach(function(section) {
    section.style.display = 'none';
  });

  var activeSection = document.getElementById(`${page}Content`);
  if (activeSection) {
    activeSection.style.display = 'block';
  }

  console.log("Active page set to", page);
}

// Function to show the settings modal
function showSettingsModal() {
  var modal = document.querySelector("#settingsModal .modal-content");
  modal.style.display = 'block'; 
}

function hideSettingsModal() {
  var modal = document.querySelector("#settingsModal .modal-content");
  modal.style.display = 'none'; 
}


// When the user clicks on the button, open the modal
var settingsBtn = document.querySelector(".nav-section.bottom a[href='#']");
settingsBtn.onclick = function(event) {
  event.preventDefault(); // Prevent the default anchor link behavior
  showSettingsModal();
}
// Function to show the logout modal
function showLogoutModal() {
  var modal = document.querySelector("#logoutModal .modal-content");
  modal.style.display = 'block'; 
}

function hideLogoutModal() {
  var modal = document.querySelector("#logoutModal .modal-content");
  modal.style.display = 'none'; 
}

// When the user clicks on the "Log Out" button, open the modal
var logoutLink = document.querySelector(".logout");
logoutLink.onclick = function(event) {
  event.preventDefault(); // Prevent the default anchor link behavior
  showLogoutModal();
}
document.getElementById("logoutBtn").onclick = function() {
  console.log('Logging out');
  // Perform your logout operation here
  hideLogoutModal(); // then close the modal
};

// When the user clicks on <span> (x), close the modal
var closeButtons = document.getElementsByClassName("close");
for (var i = 0; i < closeButtons.length; i++) {
  closeButtons[i].onclick = function() {
    hideSettingsModal();
    hideLogoutModal();
  }
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var settingsModal = document.getElementById("settingsModal");
  var logoutModal = document.getElementById("logoutModal");
  if (event.target === settingsModal || event.target === logoutModal) {
    hideSettingsModal();
    hideLogoutModal();
  }
}

// Ensure that the functions are not executed until the entire page is loaded
window.onload = function() {
  console.log('Page fully loaded');
}
async function getRoadmap() {
  const topic = document.getElementById('topic').value.trim();
  const timeAvailable = document.getElementById('timeAvailable').value.trim();
  const skillLevel = document.getElementById('skillLevel').value;
  const specificGoals = document.getElementById('specificGoals').value.trim();
  const dailyCommitment = document.getElementById('dailyCommitment').value.trim();

  if (!topic || !timeAvailable || !dailyCommitment) {
      alert('Please fill out all required fields!');
      return;
  }

  const userMessage = `Learn ${topic} in ${timeAvailable}. Current skill level: ${skillLevel}. Specific goals: ${specificGoals}. Can commit ${dailyCommitment} hours daily.`;

  document.querySelector('button').disabled = true;

  try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                  { role: "system", content: "You are a helpful assistant. Provide a detailed and structured learning roadmap based on the user's input. Dont ever give an explation, just the roadmap. Include links for pages or books if needed." },
                  { role: "user", content: userMessage }
              ],
              max_tokens: 1000
          })
      });

      const data = await response.json();

      if (data.error) {
          throw new Error(data.error.message);
      }

      const message = data.choices[0]?.message?.content || 'No response generated.';
      document.getElementById('roadmapOutput').innerText = message;
  } catch (error) {
      alert('Failed to get the roadmap: ' + error.message);
  } finally {
      document.querySelector('button').disabled = false;
  }
}

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  // Apply dark mode to other main components
  document.querySelector('.navbar').classList.toggle('dark-mode', isDarkMode);
  document.querySelectorAll('.modal').forEach(modal => modal.classList.toggle('dark-mode', isDarkMode));
  document.querySelectorAll('.content-section').forEach(section => section.classList.toggle('dark-mode', isDarkMode));
  document.getElementById('landingTitle').classList.toggle('dark-mode', isDarkMode); // Apply dark mode to landingTitle

  // Save preference to localStorage
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Apply dark mode on page load if previously enabled
if (localStorage.getItem('darkMode') === 'enabled') {
  toggleDarkMode();
  document.getElementById('darkModeToggle').checked = true;
}
