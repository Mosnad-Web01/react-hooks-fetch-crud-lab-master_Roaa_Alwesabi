import React, { useState, useEffect } from "react";

function QuestionForm({ setQuestions, setPage }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctIndex: 0,
  });

  const [successMessage, setSuccessMessage] = useState("");
  
  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newQuestion = {
      prompt: formData.prompt,
      answers: [formData.answer1, formData.answer2, formData.answer3, formData.answer4],
      correctIndex: parseInt(formData.correctIndex),
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add the question");
        }
        return response.json();
      })
      .then((newQuestion) => {
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        setSuccessMessage("Question added successfully!");
      })
      .catch((error) => {
        console.error("Error adding question:", error);
      });
  }

  // Use effect to redirect after showing success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setPage("List");
        setSuccessMessage(""); // Clear the message after redirect
      }, 2000); // Redirect after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [successMessage, setPage]);

  return (
    <section>
      <h1>New Question</h1>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={formData.answer1}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={formData.answer2}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 3:
          <input
            type="text"
            name="answer3"
            value={formData.answer3}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 4:
          <input
            type="text"
            name="answer4"
            value={formData.answer4}
            onChange={handleChange}
          />
        </label>
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            <option value="0">{formData.answer1}</option>
            <option value="1">{formData.answer2}</option>
            <option value="2">{formData.answer3}</option>
            <option value="3">{formData.answer4}</option>
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
