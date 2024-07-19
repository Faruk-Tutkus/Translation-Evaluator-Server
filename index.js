var count = 0
var count_2 = 0
var interval = null
var interval_2 = null
document.getElementById('evaluate').addEventListener('click', async (event) => {
    event.preventDefault();
    const original = document.getElementById('originalLanguage');
    const originalLanguage = original.options[original.selectedIndex].text;

    const translated = document.getElementById('translatedLanguage');
    const translatedLanguage = translated.options[translated.selectedIndex].text;

    const originalText = document.getElementById('originalText').value
    const translatedText = document.getElementById('translatedText').value
  
    if (originalText != '' && translatedText != '' && originalLanguage != translatedLanguage) {
      try {
        const response = await fetch('api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ originalText, translatedText, originalLanguage, translatedLanguage }),
        });

        const info = await response.json();
        const text = info.response
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/"([^"]*)"/g, '<span class="italic">"$1"</span>')
        document.getElementById('info').innerHTML = `${text}`
      } catch (error) {
          console.error('Error translating text:', error);
      }
    }
    if (originalText == '') {
      const shakeAnim = [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(0)" },
      ];
      const shakeTiming = {
        duration: 250,
        iterations: 2,
      };
      document.getElementById('originalText').animate(shakeAnim,shakeTiming)
    }
    if (translatedText == '') {
      const shakeAnim = [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(0)" },
      ];
      const shakeTiming = {
        duration: 250,
        iterations: 2,
      };
      document.getElementById('translatedText').animate(shakeAnim,shakeTiming)
    }
    document.getElementById('warning').innerHTML = ''
    if (translatedText == '' || originalText == '') {
      clearInterval(interval)
      let warning;
      if (translatedText == '' && originalText == '') {
        warning = 'Please enter the original and tranlation text content'
      }
      else if (originalText == '') {
        warning = 'Please enter the original text content'
      }
      else if (translatedText == '') {
        warning = 'Please enter the tranlation text content'
      }
      document.getElementById('warning').innerHTML = ''
      count = 0
      interval = setInterval(WriteWarming, 10, warning, 'warning')
    }
    if (originalLanguage == translatedLanguage) {
      clearInterval(interval)
      const warning = 'The original language and the translation language cannot be the same'
      document.getElementById('warning').innerHTML = ''
      count = 0
      interval = setInterval(WriteWarming, 10, warning, 'warning')
      const shakeAnim = [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(0)" },
      ];
      const shakeTiming = {
        duration: 250,
        iterations: 2,
      };
      document.getElementById('originalLanguage').animate(shakeAnim,shakeTiming)
      document.getElementById('translatedLanguage').animate(shakeAnim,shakeTiming)
    }
})

document.getElementById('generate').addEventListener('click', async (event) => {
  event.preventDefault();
  const value = document.getElementById('proficiencyRange').value
  document.getElementById('translatedText').value = ''
  let level = 'A1'
  if (value == '0') {
    level = 'A1'
  }
  else if (value == '1') {
    level = 'A2'
  }
  else if (value == '2') {
    level = 'B1'
  }
  else if (value == '3') {
    level = 'B2'
  }
  else if (value == '4') {
    level = 'C1'
  }
  else if (value == '5') {
    level = 'C2'
  }
  console.log(level, value)
  const original = document.getElementById('originalLanguage');
  const originalLanguage = original.options[original.selectedIndex].text;
  const topic = topics[Math.floor(Math.random() * topics.length)];
  try {
    const response = await fetch('api/random', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level, topic, originalLanguage }),
    });

    const info = await response.json();
    console.log(info);

    const text = info.response
    document.getElementById('originalText').value = ''
    count_2 = 0
    interval_2 = setInterval(WriteOriginalText, 10, text, 'originalText')
    
  } catch (error) {
    console.error('Error fetching random sentence:', error);
  }
})
function WriteWarming(text, ID){
  document.getElementById(`${ID}`).innerHTML += text[count]
  count++
  if (count >= text.length) {
    clearInterval(interval)
    count = 0
  }
  //console.log(count)
}
function WriteOriginalText(text, ID){
  document.getElementById(`${ID}`).value += text[count_2]
  count_2++
  if (count_2 >= text.length) {
    clearInterval(interval_2)
    count_2 = 0
  }
  //console.log(count)
}
