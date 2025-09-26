// Store original HTML for reset functionality
      const originalHTML = {
        1: document.getElementById('playground1').innerHTML,
        2: document.getElementById('playground2').innerHTML,
        3: document.getElementById('playground3').innerHTML,
        4: document.getElementById('playground4').innerHTML,
        5: document.getElementById('playground5').innerHTML
      }

      // Store completed challenges
      let completedChallenges =
        JSON.parse(localStorage.getItem('jqueryCompleted')) || []

      // Update progress on page load
      updateProgress()

      function runCode(challengeNum) {
        const code = document.getElementById(`code${challengeNum}`).value
        const resultDiv = document.getElementById(`result${challengeNum}`)
        const playground = document.getElementById(`playground${challengeNum}`)

        // Clear previous result
        resultDiv.style.display = 'none'
        resultDiv.className = 'result'

        try {
          // Save original playground HTML
          const originalPlaygroundHTML = playground.innerHTML

          // Execute the code
          eval(code)

          // Check if the challenge is completed
          let isCompleted = false

          switch (challengeNum) {
            case 1:
              // Check if special paragraphs are highlighted
              const specialParas = playground.querySelectorAll('p.special')
              isCompleted =
                specialParas.length > 0 &&
                Array.from(specialParas).every(
                  p =>
                    p.style.backgroundColor === 'yellow' ||
                    p.style.backgroundColor === 'rgb(255, 255, 0)'
                )
              break
            case 2:
              // Check if new list item was added
              const listItems = playground.querySelectorAll('#myList li')
              isCompleted =
                listItems.length === 4 &&
                Array.from(listItems).some(li =>
                  li.textContent.includes('New Item')
                )
              break
            case 3:
              // Check if boxes are blue with border
              const boxes = playground.querySelectorAll('.box')
              isCompleted =
                boxes.length > 0 &&
                Array.from(boxes).every(
                  box =>
                    (box.style.backgroundColor === 'blue' ||
                      box.style.backgroundColor === 'rgb(0, 0, 255)') &&
                    box.style.border
                )
              break
            case 4:
              // Check if second para is removed and first is cloned
              isCompleted =
                !playground.querySelector('#para2') &&
                playground.querySelector('#target p')
              break
            case 5:
              // Check if toggle functionality works
              const toggleText = playground.querySelector('#toggleText')
              const originalDisplay = toggleText.style.display

              // Simulate a click
              playground.querySelector('#toggleBtn').click()
              const afterClickDisplay = toggleText.style.display

              // Click again to return to original state
              playground.querySelector('#toggleBtn').click()

              isCompleted = originalDisplay !== afterClickDisplay
              break
          }

          if (isCompleted) {
            resultDiv.innerHTML =
              '<strong>Success!</strong> You completed the challenge correctly.'
            resultDiv.className = 'result success'

            // Mark challenge as completed if not already
            if (!completedChallenges.includes(challengeNum)) {
              completedChallenges.push(challengeNum)
              localStorage.setItem(
                'jqueryCompleted',
                JSON.stringify(completedChallenges)
              )
              updateProgress()
            }
          } else {
            resultDiv.innerHTML =
              '<strong>Not quite right.</strong> Try again or check the hint.'
            resultDiv.className = 'result error'
          }

          resultDiv.style.display = 'block'
        } catch (error) {
          resultDiv.innerHTML = `<strong>Error:</strong> ${error.message}`
          resultDiv.className = 'result error'
          resultDiv.style.display = 'block'
        }
      }

      function resetChallenge(challengeNum) {
        document.getElementById(`playground${challengeNum}`).innerHTML =
          originalHTML[challengeNum]
        document.getElementById(`code${challengeNum}`).value =
          challengeNum === 1
            ? '// Write your jQuery code here\n// Example: $("p").css("color", "red");'
            : '// Write your jQuery code here'
        document.getElementById(`result${challengeNum}`).style.display = 'none'
      }

      function toggleHint(challengeNum) {
        const hint = document.getElementById(`hint${challengeNum}`)
        const button = document.querySelector(
          `#hint${challengeNum}`
        ).previousElementSibling

        if (hint.style.display === 'block') {
          hint.style.display = 'none'
          button.textContent = 'Show Hint'
        } else {
          hint.style.display = 'block'
          button.textContent = 'Hide Hint'
        }
      }

      function updateProgress() {
        const progressBar = document.getElementById('progressBar')
        const progressText = document.getElementById('progressText')

        const progress = (completedChallenges.length / 5) * 100
        progressBar.style.width = `${progress}%`

        if (completedChallenges.length === 5) {
          progressText.innerHTML = `<span class="completed">100% Complete! Congratulations! 🎉</span>`
        } else {
          progressText.textContent = `${progress}% Complete (${completedChallenges.length}/5 Challenges)`
        }
      }