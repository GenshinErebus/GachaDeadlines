    // Database of funny developer fortune teller quotes
    const predictions = [
      "Prediction: Your next pull request will be approved instantly without a single comment. (Highly rare event!)",
      "Prediction: Avoid editing production code directly today. The server deities seem deeply displeased with your cache.",
      "Prediction: A rogue semicolon is currently hiding in your code, waiting for you to deploy to production.",
      "Prediction: You will soon find the stack overflow answer that solves your exact problem, written by an anonymous hero in 2014.",
      "Prediction: The bug you have been chasing for three days is just a typo in a variable name. Check line 42.",
      "Prediction: Your coffee levels are critically low. Replenish immediately to avoid compile-time syntax errors.",
      "Prediction: A massive performance boost is coming to your local environment. Your RAM will thank you.",
      "Prediction: Someone will praise your clean indentation structure in the near future. Keep spacing."
    ];

    function generatePrediction() {
      const display = document.getElementById("fortune-text");
      
      const seed = Date.now() + Math.random();
      const idx = Math.floor((seed * 7) % predictions.length);
      
      display.innerText = predictions[idx];
    }

    // Initialize instantly on document loading
    generatePrediction();